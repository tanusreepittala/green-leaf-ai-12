import { motion } from "framer-motion";
import { ArrowLeft, Thermometer, Droplets, CloudRain, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

const weatherData = [
  { icon: Thermometer, label: "Temperature", value: "32°C", detail: "Feels like 35°C", color: "bg-warning/10 text-warning" },
  { icon: Droplets, label: "Humidity", value: "78%", detail: "High moisture", color: "bg-blue-100 text-blue-600" },
  { icon: CloudRain, label: "Rainfall", value: "60%", detail: "Rain expected today", color: "bg-primary/10 text-primary" },
];

const advice = [
  "Delay spraying pesticides — rain expected in 4 hours.",
  "High humidity increases risk of fungal diseases. Monitor closely.",
  "Good conditions for transplanting seedlings this evening.",
];

const WeatherAdvisory = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="gradient-header p-6 pb-8 rounded-b-[2rem]">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/home")} className="w-10 h-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Weather Advisory</h1>
        </div>
      </div>

      <div className="px-5 -mt-4 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {weatherData.map((w, i) => (
            <motion.div
              key={w.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="surface-card p-4 flex flex-col items-center text-center gap-2"
            >
              <div className={`w-12 h-12 rounded-2xl ${w.color} flex items-center justify-center`}>
                <w.icon className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{w.label}</p>
              <p className="text-2xl font-bold text-foreground">{w.value}</p>
              <p className="text-xs text-muted-foreground">{w.detail}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="surface-card p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Leaf className="w-5 h-5 text-accent" />
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              AI Farming Advice
            </p>
          </div>
          <div className="space-y-3">
            {advice.map((a, i) => (
              <div key={i} className="bg-muted p-4 rounded-xl">
                <p className="text-sm font-medium text-foreground leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default WeatherAdvisory;
