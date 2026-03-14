import { motion } from "framer-motion";
import { ArrowLeft, Leaf, AlertTriangle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

const history = [
  { plant: "Tomato", disease: "Leaf Rust", severity: "High", date: "Mar 12, 2026", icon: AlertTriangle, color: "text-destructive bg-destructive/10" },
  { plant: "Rice", disease: "Blast Disease", severity: "Medium", date: "Mar 8, 2026", icon: AlertTriangle, color: "text-warning bg-warning/10" },
  { plant: "Wheat", disease: "Healthy", severity: "Low", date: "Mar 3, 2026", icon: CheckCircle, color: "text-success bg-success/10" },
  { plant: "Cotton", disease: "Whitefly Infestation", severity: "High", date: "Feb 25, 2026", icon: AlertTriangle, color: "text-destructive bg-destructive/10" },
];

const CropHistory = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="gradient-header p-6 pb-8 rounded-b-[2rem]">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/home")} className="w-10 h-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Crop History</h1>
        </div>
      </div>

      <div className="px-5 -mt-4 space-y-3">
        {history.map((h, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="surface-card-hover p-5 flex items-center gap-4 cursor-pointer"
            onClick={() => navigate("/diagnosis")}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${h.color}`}>
              <h.icon className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-accent" />
                <p className="font-bold text-foreground">{h.plant}</p>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{h.disease}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{h.date}</p>
              <p className={`text-xs font-semibold mt-1 ${h.severity === "High" ? "text-destructive" : h.severity === "Medium" ? "text-warning" : "text-success"}`}>
                {h.severity}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default CropHistory;
