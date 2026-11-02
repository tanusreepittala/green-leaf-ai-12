import { motion } from "framer-motion";
import { Leaf, Mail, Lock, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === "signup") {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      setLoading(false);
      if (signUpError) {
        setError(signUpError.message);
        return;
      }
      setNeedsConfirmation(true);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    navigate("/home");
  };

  const handleSocialAuth = async (provider: "google" | "lovable") => {
    setError(null);
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.origin,
    });
    setLoading(false);
    if (result.error) setError(result.error.message);
    if (result.redirected) return; // browser is heading to the provider
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="gradient-header p-6 pb-10 rounded-b-[2rem]">
        <button
          onClick={() => navigate("/")}
          className="w-10 h-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center text-center mt-4">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-3">
            <Leaf className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-xl font-bold">AI Plant Health Assistant</h1>
          <p className="text-primary-foreground/80 text-sm mt-1">
            Sign in to save your plant scans
          </p>
        </div>
      </div>

      <div className="px-5 -mt-6 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="surface-card p-6"
        >
          {needsConfirmation ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-success" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Check your email</h2>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                We sent a confirmation link to <span className="font-semibold text-foreground">{email}</span>.
                Click it to activate your account, then sign in.
              </p>
              <button
                onClick={() => { setNeedsConfirmation(false); setMode("signin"); }}
                className="w-full mt-6 py-4 rounded-2xl bg-primary text-primary-foreground font-bold"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <>
              <div className="flex rounded-2xl bg-muted p-1 mb-6">
                {(["signin", "signup"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); setError(null); }}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                      mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {m === "signin" ? "Sign In" : "Sign Up"}
                  </button>
                ))}
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-3">
                <div className="relative">
                  <Mail className="w-5 h-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-muted text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div className="relative">
                  <Lock className="w-5 h-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password (6+ characters)"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-muted text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive bg-destructive/10 rounded-xl px-4 py-3">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-accent text-accent-foreground font-bold text-base shadow-[0_10px_20px_-5px_rgba(34,197,94,0.3)] disabled:opacity-60"
                >
                  {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
                </button>
              </form>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground font-medium">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleSocialAuth("google")}
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-muted font-bold text-foreground flex items-center justify-center gap-3 disabled:opacity-60"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.2h6.5c-.1 1.1-.8 2.7-2.4 3.8l3.7 2.9c2.2-2 3.7-5 3.7-8.7z" />
                    <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.7-2.9c-1 .7-2.4 1.2-4.2 1.2-3.1 0-5.8-2.1-6.7-5l-3.9 3C3.4 21.3 7.4 24 12 24z" />
                    <path fill="#FBBC05" d="M5.3 14.4c-.3-.7-.4-1.5-.4-2.4s.1-1.7.4-2.4l-3.9-3C.5 8.2 0 10 0 12s.5 3.8 1.4 5.4l3.9-3z" />
                    <path fill="#EA4335" d="M12 4.7c2.2 0 3.7.9 4.6 1.7l3.4-3.3C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.7 1.4 6.6l3.9 3c.9-2.9 3.6-4.9 6.7-4.9z" />
                  </svg>
                  Continue with Google
                </button>
                <button
                  onClick={() => handleSocialAuth("lovable")}
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-muted font-bold text-foreground flex items-center justify-center gap-3 disabled:opacity-60"
                >
                  <Leaf className="w-5 h-5 text-accent" />
                  Continue with Lovable
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
