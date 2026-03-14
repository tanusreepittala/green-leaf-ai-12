import { Mic } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const VoiceFab = () => {
  const navigate = useNavigate();

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => navigate("/voice")}
      className="fixed bottom-20 right-5 w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-2xl flex items-center justify-center z-40"
    >
      <Mic className="w-7 h-7" />
    </motion.button>
  );
};

export default VoiceFab;
