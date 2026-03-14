import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Globe, Check } from "lucide-react";
import { useState } from "react";

const languages = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
];

const LanguageSelect = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (code: string) => {
    setSelected(code);
    setTimeout(() => navigate("/home"), 400);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="flex items-center justify-center mb-8">
          <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
            <Globe className="w-7 h-7 text-accent" />
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground text-center mb-2">
          Choose Your Language
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          Select a language to continue
        </p>

        <div className="flex flex-col gap-4">
          {languages.map((lang, i) => (
            <motion.button
              key={lang.code}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(lang.code)}
              className={`h-20 flex items-center justify-between px-8 rounded-2xl transition-all duration-200 ${
                selected === lang.code
                  ? "bg-accent text-accent-foreground shadow-[0_10px_20px_-5px_rgba(34,197,94,0.3)]"
                  : "surface-card-hover"
              }`}
            >
              <div className="flex flex-col items-start">
                <span className="text-lg font-bold">{lang.label}</span>
                <span className={`text-sm ${selected === lang.code ? "text-accent-foreground/80" : "text-muted-foreground"}`}>
                  {lang.native}
                </span>
              </div>
              <div
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                  selected === lang.code
                    ? "border-accent-foreground bg-accent-foreground/20"
                    : "border-muted-foreground/30"
                }`}
              >
                {selected === lang.code && <Check className="w-4 h-4" />}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LanguageSelect;
