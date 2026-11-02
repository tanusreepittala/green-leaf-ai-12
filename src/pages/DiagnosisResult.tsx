import { motion } from "framer-motion";
import { ArrowLeft, AlertTriangle, Leaf, Shield, Droplets } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Scan = Database["public"]["Tables"]["plant_scans"]["Row"];

const parseSteps = (text: string | null) =>
  (text ?? "")
    .split("\n")
    .map((line) => line.replace(/^[-•*\d.)\s]+/, "").trim())
    .filter(Boolean);

const DiagnosisResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scan, setScan] = useState<Scan | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">("loading");

  useEffect(() => {
    let active = true;
    supabase
      .from("plant_scans")
      .select("*")
      .eq("id", id ?? "")
      .single()
      .then(async ({ data, error }) => {
        if (!active) return;
        if (error || !data) {
          setStatus("missing");
          return;
        }
        setScan(data);
        setStatus("ready");
        if (data.image_url) {
          const { data: signed } = await supabase.storage
            .from("plant-images")
            .createSignedUrl(data.image_url, 60 * 60);
          if (active && signed) setImageUrl(signed.signedUrl);
        }
      });
    return () => {
      active = false;
    };
  }, [id]);

  const severityConfig = {
    Low: { bg: "bg-success/10", text: "text-success", label: "Healthy" },
    Medium: { bg: "bg-warning/10", text: "text-warning", label: "Moderate" },
    High: { bg: "bg-destructive/10", text: "text-destructive", label: "Severe" },
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading result...</p>
      </div>
    );
  }

  if (status === "missing" || !scan) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-6 text-center">
        <Leaf className="w-12 h-12 text-muted-foreground/40" />
        <p className="font-bold text-foreground">Result not found</p>
        <p className="text-sm text-muted-foreground">This scan may have been deleted.</p>
        <button
          onClick={() => navigate("/history")}
          className="mt-2 py-3 px-8 bg-accent text-accent-foreground rounded-2xl font-bold"
        >
          Back to History
        </button>
      </div>
    );
  }

  const severity = (scan.severity ?? "Low") as keyof typeof severityConfig;
  const sev = severityConfig[severity];
  const confidence = scan.confidence ?? 0;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="gradient-header p-6 pb-8 rounded-b-[2rem]">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/scanner")} className="w-10 h-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Diagnosis Result</h1>
        </div>
      </div>

      <div className="px-5 -mt-4 space-y-4">
        {/* Photo */}
        {imageUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="surface-card p-3"
          >
            <img
              src={imageUrl}
              alt={scan.plant_name ?? "Scanned plant"}
              className="w-full aspect-video object-cover rounded-xl"
            />
          </motion.div>
        )}

        {/* Severity Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`surface-card p-6 ${sev.bg}`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-12 h-12 rounded-full ${sev.bg} flex items-center justify-center`}>
              <AlertTriangle className={`w-6 h-6 ${sev.text}`} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Severity: {severity} · {sev.label}
              </p>
              <p className="text-xl font-bold text-foreground">{scan.disease_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${confidence}%` }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className={`h-full rounded-full ${
                  severity === "High" ? "bg-destructive" : severity === "Medium" ? "bg-warning" : "bg-success"
                }`}
              />
            </div>
            <span className="text-sm font-bold text-foreground">{confidence}%</span>
          </div>
        </motion.div>

        {/* Plant Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="surface-card p-6"
        >
          <div className="flex items-center gap-3 mb-1">
            <Leaf className="w-5 h-5 text-accent" />
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Plant Identified
            </p>
          </div>
          <p className="text-lg font-bold text-foreground">{scan.plant_name ?? "Unknown plant"}</p>
        </motion.div>

        {/* Treatment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="surface-card p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Droplets className="w-5 h-5 text-accent" />
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Treatment
            </p>
          </div>
          <div className="space-y-3">
            {parseSteps(scan.treatment_advice).map((step, i) => (
              <div key={i} className="bg-muted p-4 rounded-xl">
                <p className="text-sm font-medium text-foreground leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Prevention */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="surface-card p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Prevention Tips
            </p>
          </div>
          <div className="space-y-3">
            {parseSteps(scan.prevention_advice).map((tip, i) => (
              <div key={i} className="bg-muted p-4 rounded-xl">
                <p className="text-sm font-medium text-foreground leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default DiagnosisResult;
