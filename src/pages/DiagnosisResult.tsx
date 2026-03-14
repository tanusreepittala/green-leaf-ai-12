import { motion } from "framer-motion";
import { ArrowLeft, AlertTriangle, Leaf, Shield, Droplets } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

const DiagnosisResult = () => {
  const navigate = useNavigate();

  const result = {
    plant: "Tomato",
    disease: "Leaf Rust (Puccinia recondita)",
    severity: "High" as const,
    confidence: 94,
    treatments: [
      "Remove infected leaves immediately",
      "Apply copper-based fungicide every 7 days",
      "Ensure proper spacing between plants for airflow",
    ],
    prevention: [
      "Use disease-resistant varieties",
      "Rotate crops annually",
      "Avoid overhead watering",
    ],
  };

  const severityConfig = {
    Low: { bg: "bg-success/10", text: "text-success", label: "Healthy" },
    Medium: { bg: "bg-warning/10", text: "text-warning", label: "Moderate" },
    High: { bg: "bg-destructive/10", text: "text-destructive", label: "Severe" },
  };
  const sev = severityConfig[result.severity];

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
                Severity: {result.severity}
              </p>
              <p className="text-xl font-bold text-foreground">{result.disease}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${result.confidence}%` }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className={`h-full rounded-full ${result.severity === "High" ? "bg-destructive" : result.severity === "Medium" ? "bg-warning" : "bg-success"}`}
              />
            </div>
            <span className="text-sm font-bold text-foreground">{result.confidence}%</span>
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
          <p className="text-lg font-bold text-foreground">{result.plant}</p>
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
            {result.treatments.map((t, i) => (
              <div key={i} className="bg-muted p-4 rounded-xl">
                <p className="text-sm font-medium text-foreground leading-relaxed">{t}</p>
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
            {result.prevention.map((t, i) => (
              <div key={i} className="bg-muted p-4 rounded-xl">
                <p className="text-sm font-medium text-foreground leading-relaxed">{t}</p>
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
