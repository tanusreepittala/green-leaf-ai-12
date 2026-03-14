import { motion } from "framer-motion";
import { ArrowLeft, Landmark, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

const schemes = [
  {
    title: "PM-KISAN",
    desc: "Direct income support of ₹6,000/year to farmer families in 3 installments.",
    tag: "Income Support",
  },
  {
    title: "Crop Insurance (PMFBY)",
    desc: "Low-premium insurance covering crop loss from natural calamities, pests, and diseases.",
    tag: "Insurance",
  },
  {
    title: "Soil Health Card",
    desc: "Free soil testing and nutrient recommendations for every farm field.",
    tag: "Soil Health",
  },
  {
    title: "Kisan Credit Card",
    desc: "Easy access to short-term credit for farming needs at subsidized interest rates.",
    tag: "Credit",
  },
  {
    title: "Drip Irrigation Subsidy",
    desc: "Up to 55% subsidy on drip and sprinkler irrigation systems for water conservation.",
    tag: "Irrigation",
  },
];

const GovSchemes = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="gradient-header p-6 pb-8 rounded-b-[2rem]">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/home")} className="w-10 h-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Government Schemes</h1>
        </div>
      </div>

      <div className="px-5 -mt-4 space-y-3">
        {schemes.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="surface-card-hover p-5 cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-2">
                  {s.tag}
                </span>
                <h3 className="font-bold text-foreground text-lg">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{s.desc}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 mt-1">
                <ExternalLink className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default GovSchemes;
