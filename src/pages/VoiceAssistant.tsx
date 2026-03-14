import { motion } from "framer-motion";
import { ArrowLeft, Mic } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

const VoiceAssistant = () => {
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-24 flex flex-col">
      <div className="gradient-header p-6 pb-8 rounded-b-[2rem]">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/home")} className="w-10 h-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">AI Voice Assistant</h1>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="relative mb-8">
          {listening && (
            <>
              <motion.div
                animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0 rounded-full bg-accent"
              />
              <motion.div
                animate={{ scale: [1, 1.3], opacity: [0.2, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut", delay: 0.3 }}
                className="absolute inset-0 rounded-full bg-accent"
              />
            </>
          )}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setListening(!listening)}
            className={`relative w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-colors duration-200 ${
              listening ? "bg-accent" : "bg-primary"
            }`}
          >
            <Mic className="w-10 h-10 text-primary-foreground" />
          </motion.button>
        </div>

        <p className="text-lg font-bold text-foreground text-center">
          {listening ? "Listening for your question..." : "Tap to ask a question"}
        </p>
        <p className="text-sm text-muted-foreground mt-2 text-center max-w-xs leading-relaxed">
          {listening
            ? "Speak clearly about your crop concern"
            : 'Example: "When should I spray my tomato plants?"'}
        </p>

        {listening && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 surface-card p-4 w-full max-w-sm"
          >
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className="w-2 h-2 rounded-full bg-accent"
              />
              <p className="text-sm text-muted-foreground italic">Processing your voice...</p>
            </div>
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default VoiceAssistant;
