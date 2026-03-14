import { motion } from "framer-motion";
import { Camera, Upload, MessageCircle, Cloud, History, Landmark, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import VoiceFab from "@/components/VoiceFab";

const features = [
  { icon: Camera, label: "Scan Plant", desc: "Disease detection", path: "/scanner", color: "bg-accent/10 text-accent" },
  { icon: Upload, label: "Upload Image", desc: "From gallery", path: "/scanner", color: "bg-primary/10 text-primary" },
  { icon: MessageCircle, label: "Ask AI", desc: "Chat assistant", path: "/voice", color: "bg-warning/10 text-warning" },
  { icon: Cloud, label: "Weather", desc: "Farm advisory", path: "/weather", color: "bg-blue-100 text-blue-600" },
  { icon: History, label: "Crop History", desc: "Past scans", path: "/history", color: "bg-secondary text-foreground" },
  { icon: Landmark, label: "Gov Schemes", desc: "Subsidies & aid", path: "/schemes", color: "bg-accent/10 text-accent" },
];

const HomeDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="gradient-header p-8 pb-14 rounded-b-[3rem]">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Leaf className="w-7 h-7" />
            <span className="text-xs font-semibold uppercase tracking-wider opacity-80">
              Plant Health AI
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Your crops are in good hands.
          </h1>
          <p className="mt-2 opacity-80 leading-relaxed">
            Scan, diagnose, and protect your plants with AI.
          </p>
        </motion.div>
      </div>

      {/* Feature Grid */}
      <div className="px-5 -mt-8">
        <div className="grid grid-cols-2 gap-4">
          {features.map((f, i) => (
            <motion.button
              key={f.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, ease: [0.4, 0, 0.2, 1] }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate(f.path)}
              className="surface-card-hover aspect-square flex flex-col items-center justify-center gap-3 p-4"
            >
              <div className={`w-14 h-14 rounded-2xl ${f.color} flex items-center justify-center`}>
                <f.icon className="w-7 h-7" />
              </div>
              <div className="text-center">
                <p className="font-bold text-sm text-foreground">{f.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <VoiceFab />
      <BottomNav />
    </div>
  );
};

export default HomeDashboard;
