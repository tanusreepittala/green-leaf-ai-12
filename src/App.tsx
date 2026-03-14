import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Welcome from "./pages/Welcome";
import LanguageSelect from "./pages/LanguageSelect";
import HomeDashboard from "./pages/HomeDashboard";
import PlantScanner from "./pages/PlantScanner";
import DiagnosisResult from "./pages/DiagnosisResult";
import WeatherAdvisory from "./pages/WeatherAdvisory";
import CropHistory from "./pages/CropHistory";
import GovSchemes from "./pages/GovSchemes";
import VoiceAssistant from "./pages/VoiceAssistant";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/language" element={<LanguageSelect />} />
          <Route path="/home" element={<HomeDashboard />} />
          <Route path="/scanner" element={<PlantScanner />} />
          <Route path="/diagnosis" element={<DiagnosisResult />} />
          <Route path="/weather" element={<WeatherAdvisory />} />
          <Route path="/history" element={<CropHistory />} />
          <Route path="/schemes" element={<GovSchemes />} />
          <Route path="/voice" element={<VoiceAssistant />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
