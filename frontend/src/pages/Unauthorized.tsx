import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldX, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { getPortalLoginRoute, ROLE_LABELS } from "@/lib/rbac";

const Unauthorized = () => {
  const { role, portal, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full text-center">
        <ShieldX className="h-20 w-20 text-destructive mx-auto mb-6" />
        <h1 className="text-3xl font-display font-bold text-foreground mb-3">Access Denied</h1>
        <p className="text-muted-foreground font-body mb-2">
          Your account role <strong className="text-foreground">({ROLE_LABELS[role]})</strong> is not authorized to access this portal.
        </p>
        <p className="text-sm text-muted-foreground/60 font-body mb-8">
          This attempt has been logged for security audit.
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => { logout(); navigate("/"); }} className="font-body rounded-xl" data-testid="go-home-btn">
            <ArrowLeft className="h-4 w-4 mr-2" /> Go Home
          </Button>
          <Button onClick={() => navigate(getPortalLoginRoute(portal))} className="font-body rounded-xl" data-testid="go-to-portal-btn">
            Go to Your Portal
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Unauthorized;
