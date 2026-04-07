import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AppLogin from "./pages/AppLogin";
import AppLayout from "./components/AppLayout";
import PublicDashboard from "./pages/PublicDashboard";
import VehicleReport from "./pages/VehicleReport";
import PoliceConsole from "./pages/PoliceConsole";
import GovernmentConsole from "./pages/GovernmentConsole";
import InsurancePartnerPortal from "./pages/InsurancePartnerPortal";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/app/login" element={<AppLogin />} />
            <Route path="/app" element={<AppLayout />}>
              <Route path="public" element={<PublicDashboard />} />
              <Route path="report" element={<VehicleReport />} />
              <Route path="police" element={<PoliceConsole />} />
              <Route path="government" element={<GovernmentConsole />} />
              <Route path="insurance" element={<InsurancePartnerPortal />} />
              <Route path="partners" element={<InsurancePartnerPortal />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
