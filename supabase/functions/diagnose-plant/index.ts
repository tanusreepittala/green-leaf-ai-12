import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { createOpenAI } from "npm:@ai-sdk/openai";
import { streamText, Output, NoObjectGeneratedError, type ModelMessage } from "npm:ai";
import { z } from "npm:zod";
import { createLovableAiGatewayRunIdFetch } from "../_shared/run-id.ts";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1";
const MODEL = "openai/gpt-6-astra";

// Strict-compatible schema: single object root, every property required,
// optional values nullable, no unbounded enums or numeric bounds.
const DiagnosisSchema = z.object({
  plant_name: z.string().nullable(),
  disease_name: z.string(),
  severity: z.enum(["Low", "Medium", "High"]),
  confidence: z.number(),
  treatment_advice: z.string(),
  prevention_advice: z.string(),
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function toBase64(bytes: ArrayBuffer): string {
  const arr = new Uint8Array(bytes);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < arr.length; i += chunkSize) {
    binary += String.fromCharCode(...arr.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. Verify the caller's session (JWT validated against the auth server).
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) {
      return json({ error: "Please sign in to scan a plant." }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userError } = await userClient.auth.getUser();
    const user = userData?.user;
    if (userError || !user) {
      return json({ error: "Your session has expired. Please sign in again." }, 401);
    }

    // 2. Validate input — never trust the client.
    const body = await req.json().catch(() => null);
    const imagePath = typeof body?.imagePath === "string" ? body.imagePath.trim() : "";
    const language = typeof body?.language === "string" && body.language.trim() ? body.language.trim() : "English";
    if (!imagePath || imagePath.length > 300 || !imagePath.startsWith(`${user.id}/`)) {
      return json({ error: "Invalid image path." }, 400);
    }

    // 3. Read the uploaded image through the service role (RLS on the bucket
    //    already limits users to their own folder).
    const service = createClient(supabaseUrl, serviceKey);
    const { data: blob, error: downloadError } = await service.storage
      .from("plant-images")
      .download(imagePath);
    if (downloadError || !blob) {
      return json({ error: "Could not read the uploaded image. Please try again." }, 404);
    }
    if (blob.size === 0) {
      return json({ error: "The image file is empty." }, 400);
    }
    if (blob.size > 10 * 1024 * 1024) {
      return json({ error: "The image is too large. Please upload a photo under 10 MB." }, 413);
    }

    const mime = blob.type && blob.type.startsWith("image/") ? blob.type : "image/jpeg";
    const imageDataUrl = `data:${mime};base64,${toBase64(await blob.arrayBuffer())}`;

    // 4. Ask Lovable AI to diagnose the plant photo.
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return json({ error: "AI diagnosis is not configured yet. Please try again later." }, 503);
    }

    const runIdFetch = createLovableAiGatewayRunIdFetch();
    const provider = createOpenAI({
      baseURL: GATEWAY_URL,
      apiKey,
      headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
      fetch: runIdFetch.fetch,
    });

    const system = [
      "You are an expert plant pathologist helping smallholder farmers keep their crops healthy.",
      "Identify the plant species and any visible disease, pest or deficiency from the photo.",
      `Answer in ${language}, in very simple, farmer-friendly language. Avoid jargon; explain terms briefly.`,
      "State 2-4 short treatment steps, each on its own line starting with \"- \".",
      "State 2-3 short prevention tips, each on its own line starting with \"- \".",
      "If the plant looks healthy, set disease_name to \"Healthy\" and severity to \"Low\".",
      "If the photo is too unclear to identify anything, set plant_name to null, disease_name to \"Unable to identify\", severity to \"Low\", confidence to a low number, and say what photo would help.",
    ].join(" ");

    const messages: ModelMessage[] = [
      {
        role: "user",
        content: [
          { type: "text", text: "Please diagnose this plant photo and return the structured result." },
          { type: "image", image: imageDataUrl },
        ],
      },
    ];

    const result = streamText({
      model: provider.responses(MODEL),
      system,
      messages,
      abortSignal: req.signal,
      output: Output.object({ schema: DiagnosisSchema }),
      providerOptions: {
        openai: {
          store: false,
          forceReasoning: true,
          reasoningEffort: "low",
          reasoningSummary: "auto",
          include: ["reasoning.encrypted_content"],
        },
      },
    });

    let diagnosis;
    try {
      for await (const _chunk of result.textStream) {
        // drain the stream so the gateway work completes
      }
      diagnosis = await result.output;
    } catch (err) {
      if (NoObjectGeneratedError.isInstance(err)) {
        return json(
          { error: "The photo could not be analyzed clearly. Please try a closer photo of the affected leaves." },
          502,
        );
      }
      throw err;
    }

    // 5. Save the result for this farmer.
    const confidence = Math.max(0, Math.min(100, Math.round(diagnosis.confidence)));
    const { data: scan, error: insertError } = await service
      .from("plant_scans")
      .insert({
        user_id: user.id,
        image_url: imagePath,
        plant_name: diagnosis.plant_name ?? "Unknown plant",
        disease_name: diagnosis.disease_name,
        severity: diagnosis.severity,
        confidence,
        treatment_advice: diagnosis.treatment_advice,
        prevention_advice: diagnosis.prevention_advice,
      })
      .select()
      .single();
    if (insertError) {
      console.error("plant_scans insert failed:", insertError.message);
      return json({ error: "The diagnosis was made but could not be saved. Please try again." }, 500);
    }

    const headers: Record<string, string> = { ...corsHeaders, "Content-Type": "application/json" };
    const runId = runIdFetch.getRunId();
    if (runId) headers["X-Lovable-AIG-Run-ID"] = runId;
    return new Response(JSON.stringify({ scan }), { status: 200, headers });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    const statusMatch = message.match(/\b(4\d\d|5\d\d)\b/);
    const status = statusMatch ? Number(statusMatch[1]) : 500;
    console.error("diagnose-plant failed:", message);
    return json({ error: message }, status);
  }
});
