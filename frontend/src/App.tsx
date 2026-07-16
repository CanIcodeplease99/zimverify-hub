import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { RealtimeProvider } from "@/contexts/RealtimeContext";
import { PWAInstallBanner } from "@/components/PWAInstallBanner";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AppLogin from "./pages/AppLogin";
import PoliceLogin from "./pages/PoliceLogin";
import GovLogin from "./pages/GovLogin";
import InsuranceLogin from "./pages/InsuranceLogin";
import Unauthorized from "./pages/Unauthorized";
import AuthCallback from "./pages/AuthCallback";
import ResetPassword from "./pages/ResetPassword";
import AppLayout from "./components/AppLayout";
import PublicDashboard from "./pages/PublicDashboard";
import VehicleReport from "./pages/VehicleReport";
import PoliceConsole from "./pages/PoliceConsole";
import GovernmentConsole from "./pages/GovernmentConsole";
import InsurancePartnerPortal from "./pages/InsurancePartnerPortal";
import CustomsConsole from "./pages/CustomsConsole";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RealtimeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <PWAInstallBanner />
            <Routes>
              {/* Public */}
              <Route path="/" element={<Index />} />
              <Route path="/app/login" element={<AppLogin />} />
              <Route path="/check" element={<AppLogin />} />

              {/* Secure portal logins */}
              <Route path="/portal/police/login" element={<PoliceLogin />} />
              <Route path="/portal/gov/login" element={<GovLogin />} />
              <Route path="/portal/insurance/login" element={<InsuranceLogin />} />

              {/* Auth flows */}
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Protected app routes */}
              <Route path="/app" element={<AppLayout />}>
                <Route path="public" element={<PublicDashboard />} />
                <Route path="report" element={<VehicleReport />} />
                <Route path="police" element={<PoliceConsole />} />
                <Route path="government" element={<GovernmentConsole />} />
                <Route path="insurance" element={<InsurancePartnerPortal />} />
                <Route path="partners" element={<InsurancePartnerPortal />} />
                <Route path="customs" element={<CustomsConsole />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </RealtimeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
