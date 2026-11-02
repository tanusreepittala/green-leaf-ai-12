import { motion } from "framer-motion";
import { ArrowLeft, Leaf, AlertTriangle, CheckCircle, Camera } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Database } from "@/integrations/supabase/types";

type Scan = Database["public"]["Tables"]["plant_scans"]["Row"];

const CropHistory = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/auth");
      return;
    }
    supabase
      .from("plant_scans")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setScans(data);
        setLoading(false);
      });
  }, [user, authLoading, navigate]);

  const severityIcon = (severity: string | null) =>
    severity === "High" ? AlertTriangle : severity === "Medium" ? AlertTriangle : CheckCircle;

  const severityColor = (severity: string | null) =>
    severity === "High"
      ? "text-destructive bg-destructive/10"
      : severity === "Medium"
        ? "text-warning bg-warning/10"
        : "text-success bg-success/10";

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
        {loading && (
          <div className="surface-card p-6 text-center text-muted-foreground">
            Loading your scans...
          </div>
        )}

        {!loading && scans.length === 0 && (
          <div className="surface-card p-8 flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
              <Camera className="w-7 h-7 text-accent" />
            </div>
            <p className="font-bold text-foreground">No scans yet</p>
            <p className="text-sm text-muted-foreground">
              Scan a plant to see its health history here.
            </p>
          </div>
        )}

        {scans.map((scan, i) => {
          const Icon = severityIcon(scan.severity);
          return (
            <motion.div
              key={scan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="surface-card-hover p-5 flex items-center gap-4 cursor-pointer"
              onClick={() => navigate(`/diagnosis/${scan.id}`)}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${severityColor(scan.severity)}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-accent" />
                  <p className="font-bold text-foreground truncate">{scan.plant_name ?? "Unknown plant"}</p>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5 truncate">{scan.disease_name}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">
                  {new Date(scan.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
                <p className={`text-xs font-semibold mt-1 ${
                  scan.severity === "High" ? "text-destructive" : scan.severity === "Medium" ? "text-warning" : "text-success"
                }`}>
                  {scan.severity ?? "Low"}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
};

export default CropHistory;
