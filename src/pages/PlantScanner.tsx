import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, Leaf, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const PlantScanner = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setError(null);
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target?.result as string);
      reader.readAsDataURL(selected);
    }
  };

  const handleAnalyze = async () => {
    if (!user || !file || scanning) return;
    setScanning(true);
    setError(null);

    try {
      const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
      const path = `${user.id}/scan-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("plant-images")
        .upload(path, file, { contentType: file.type || "image/jpeg" });
      if (uploadError) throw new Error("Could not upload the photo. Please try again.");

      const { data, error: fnError } = await supabase.functions.invoke("diagnose-plant", {
        body: { imagePath: path },
      });
      if (fnError) throw new Error(fnError.message);
      if (!data?.scan) throw new Error(data?.error ?? "The diagnosis could not be completed.");

      navigate(`/diagnosis/${data.scan.id}`);
    } catch (err) {
      setScanning(false);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  // Not signed in: send to the sign-in screen (after auth state settles)
  if (!authLoading && !user) {
    navigate("/auth");
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="gradient-header p-6 pb-8 rounded-b-[2rem]">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/home")} className="w-10 h-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Scan Plant</h1>
        </div>
      </div>

      <div className="px-5 -mt-4">
        <div className="surface-card p-6 flex flex-col items-center">
          {!preview ? (
            <div className="w-full aspect-square rounded-2xl bg-muted flex flex-col items-center justify-center gap-4">
              <Leaf className="w-16 h-16 text-muted-foreground/40" />
              <p className="text-muted-foreground font-medium">No image selected</p>
            </div>
          ) : (
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
              <img src={preview} alt="Plant to scan" className="w-full h-full object-cover" />
              <AnimatePresence>
                {scanning && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-primary/10"
                  >
                    <div className="scan-line" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="px-6 py-3 rounded-full bg-primary/80 backdrop-blur-sm text-primary-foreground font-semibold text-sm"
                      >
                        Analyzing...
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {error && (
            <p className="w-full mt-4 text-sm text-destructive bg-destructive/10 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <div className="flex gap-3 w-full mt-6">
            <label className="flex-1">
              <input type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />
              <div className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-primary-foreground font-bold cursor-pointer active:scale-95 transition-transform">
                <Camera className="w-5 h-5" />
                Camera
              </div>
            </label>
            <label className="flex-1">
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
              <div className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-secondary text-secondary-foreground font-bold cursor-pointer active:scale-95 transition-transform">
                <Upload className="w-5 h-5" />
                Gallery
              </div>
            </label>
          </div>

          {preview && !scanning && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleAnalyze}
              disabled={!user}
              className="w-full mt-4 py-5 bg-accent text-accent-foreground rounded-2xl font-bold text-lg shadow-[0_10px_20px_-5px_rgba(34,197,94,0.3)] disabled:opacity-50"
            >
              Analyze Plant
            </motion.button>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default PlantScanner;
