import { Home, Camera, History, Cloud } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const tabs = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: Camera, label: "Scan", path: "/scanner" },
  { icon: History, label: "History", path: "/history" },
  { icon: Cloud, label: "Weather", path: "/weather" },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border z-50">
      <div className="flex items-center justify-around max-w-lg mx-auto h-16">
        {tabs.map((tab) => {
          const active = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-1 min-w-[56px] py-2 transition-colors ${
                active ? "text-accent" : "text-muted-foreground"
              }`}
            >
              <tab.icon className="w-6 h-6" />
              <span className="text-xs font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
