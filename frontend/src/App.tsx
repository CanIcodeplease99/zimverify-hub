import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { RealtimeProvider } from "@/contexts/RealtimeContext";
import { PWAInstallBanner } from "@/components/PWAInstallBanner";
import PortalGuard from "./components/PortalGuard";
import SubdomainRedirect from "./components/SubdomainRedirect";
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
              {/* Root: subdomain-aware — auto-redirects portal subdomains */}
              <Route path="/" element={<SubdomainRedirect fallback={<Index />} />} />

              {/* Public routes — accessible on main domain only */}
              <Route path="/app/login" element={<AppLogin />} />
              <Route path="/check" element={<AppLogin />} />

              {/* Police portal — guarded: only accessible from police subdomain or dev */}
              <Route path="/portal/police/login" element={<PortalGuard portal="police"><PoliceLogin /></PortalGuard>} />
              <Route path="/login" element={<PortalGuard portal="police"><PoliceLogin /></PortalGuard>} />

              {/* Government portal — guarded */}
              <Route path="/portal/gov/login" element={<PortalGuard portal="government"><GovLogin /></PortalGuard>} />

              {/* Insurance portal — guarded */}
              <Route path="/portal/insurance/login" element={<PortalGuard portal="insurance"><InsuranceLogin /></PortalGuard>} />

              {/* Auth flows */}
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Protected dashboards — AppLayout handles auth + portal enforcement */}
              <Route path="/app" element={<AppLayout />}>
                <Route path="public" element={<PublicDashboard />} />
                <Route path="report" element={<VehicleReport />} />
                <Route path="police" element={<PoliceConsole />} />
                <Route path="government" element={<GovernmentConsole />} />
                <Route path="insurance" element={<InsurancePartnerPortal />} />
                <Route path="partners" element={<InsurancePartnerPortal />} />
                <Route path="customs" element={<CustomsConsole />} />
              </Route>

              <Route path="/not-found" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </RealtimeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
