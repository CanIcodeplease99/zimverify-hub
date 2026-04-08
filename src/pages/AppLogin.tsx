import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

const roleDescriptions: Record<string, { label: string; description: string }> = {
  public: { label: "Public User", description: "Self-service vehicle checks, purchase verification, and report downloads." },
  police: { label: "Police Officer", description: "Field operations, stolen vehicle alerts, case management, and roadside checks." },
  government: { label: "Government Analyst", description: "Oversight dashboards, agency sync, audit trails, and system governance." },
  insurance: { label: "Insurance Officer", description: "Claims verification, fraud detection, risk assessment, and batch processing." },
  partner: { label: "Commercial Partner", description: "API access, bulk uploads, fleet verification, and usage analytics." },
};

const roleDashboardRoutes: Record<UserRole, string> = {
  public: "/app/public",
  police: "/app/police",
  government: "/app/government",
  insurance: "/app/insurance",
  partner: "/app/partners",
};

const AppLogin = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>("public");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole);
    navigate(roleDashboardRoutes[selectedRole]);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: Login form */}
      <div className="flex items-center justify-center p-8 lg:p-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center gap-2 mb-10">
            <Shield className="h-8 w-8 text-primary" />
            <span className="font-display font-bold text-2xl">ZimVerify</span>
          </div>

          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Sign in to ZimVerify</h1>
          <p className="text-muted-foreground font-body mb-8">Access the National Vehicle Verification Platform</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <Label className="font-body">Role</Label>
              <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as UserRole)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(roleDescriptions).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="font-body">Email</Label>
              <Input type="email" placeholder="user@zimverify.gov.zw" className="mt-1.5" defaultValue="demo@zimverify.gov.zw" />
            </div>

            <div>
              <Label className="font-body">Password</Label>
              <div className="relative mt-1.5">
                <Input type={showPassword ? "text" : "password"} defaultValue="••••••••" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label className="font-body">OTP Code</Label>
              <Input placeholder="6-digit code" className="mt-1.5" />
            </div>

            <Button type="submit" className="w-full font-body text-base py-5">
              Sign In
            </Button>
          </form>

          <div className="flex flex-wrap gap-2 mt-6">
            <Badge variant="secondary" className="font-body text-xs">MFA Ready</Badge>
            <Badge variant="secondary" className="font-body text-xs">Audit Logged</Badge>
            <Badge variant="secondary" className="font-body text-xs">Session Control</Badge>
          </div>
        </motion.div>
      </div>

      {/* Right: Role descriptions */}
      <div className="hidden lg:flex items-center justify-center bg-primary/5 p-16">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-md space-y-6"
        >
          <h2 className="text-2xl font-display font-bold text-foreground mb-6">Platform Access Roles</h2>
          {Object.entries(roleDescriptions).map(([key, { label, description }]) => (
            <div
              key={key}
              className={`p-4 rounded-xl border transition-all ${
                selectedRole === key ? "bg-card border-primary shadow-md" : "bg-background/50 border-transparent"
              }`}
            >
              <h3 className="font-display font-semibold text-foreground">{label}</h3>
              <p className="text-sm text-muted-foreground font-body mt-1">{description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AppLogin;
