import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroLeaf from "@/assets/hero-leaf.jpg";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-end overflow-hidden">
      <img
        src={heroLeaf}
        alt="Fresh green leaf with morning dew"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/80" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="relative z-10 w-full px-6 pb-12 flex flex-col items-center text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="w-20 h-20 rounded-full bg-accent/20 backdrop-blur-md flex items-center justify-center mb-6"
        >
          <Leaf className="w-10 h-10 text-accent" />
        </motion.div>

        <h1 className="text-3xl font-bold tracking-tight text-primary-foreground mb-3">
          AI Plant Health Assistant
        </h1>
        <p className="text-primary-foreground/80 text-lg leading-relaxed mb-10 max-w-xs">
          Detect Plant Diseases and Protect Your Crops
        </p>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/language")}
          className="w-full max-w-sm py-5 px-8 bg-accent text-accent-foreground rounded-2xl font-bold text-lg shadow-[0_10px_20px_-5px_rgba(34,197,94,0.3)] flex items-center justify-center gap-3"
        >
          <Leaf className="w-6 h-6" />
          Get Started
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Welcome;
