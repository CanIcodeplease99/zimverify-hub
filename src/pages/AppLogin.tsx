import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Eye, EyeOff, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import heroCity from "@/assets/hero-city.jpg";

const roleDescriptions: Record<string, { label: string; description: string; features: string[] }> = {
  public: { label: "Public User", description: "Self-service vehicle checks, purchase verification, and report downloads.", features: ["Vehicle checks", "Report downloads", "Payment history"] },
  police: { label: "Police Officer", description: "Field operations, stolen vehicle alerts, case management, and roadside checks.", features: ["Case management", "Stolen alerts", "Field checks"] },
  government: { label: "Government Analyst", description: "Oversight dashboards, agency sync, audit trails, and system governance.", features: ["Agency oversight", "Audit trails", "System config"] },
  insurance: { label: "Insurance Officer", description: "Claims verification, fraud detection, risk assessment, and batch processing.", features: ["Claims verification", "Fraud detection", "Batch processing"] },
  partner: { label: "Commercial Partner", description: "API access, bulk uploads, fleet verification, and usage analytics.", features: ["API tokens", "Bulk uploads", "Usage analytics"] },
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

  const currentRole = roleDescriptions[selectedRole];

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: Login form */}
      <div className="flex items-center justify-center p-8 lg:p-16 bg-background">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <div className="flex items-center gap-2 mb-10">
            <Shield className="h-8 w-8 text-primary" />
            <span className="font-display font-bold text-2xl text-foreground">ZimVerify</span>
          </div>

          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Sign in to ZimVerify</h1>
          <p className="text-muted-foreground font-body mb-8">Access the National Vehicle Verification Platform</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <Label className="font-body">Role</Label>
              <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as UserRole)}>
                <SelectTrigger className="mt-1.5 h-12">
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
              <Input type="email" placeholder="user@zimverify.gov.zw" className="mt-1.5 h-12" defaultValue="demo@zimverify.gov.zw" />
            </div>

            <div>
              <Label className="font-body">Password</Label>
              <div className="relative mt-1.5">
                <Input type={showPassword ? "text" : "password"} className="h-12" defaultValue="••••••••" />
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
              <Input placeholder="6-digit code" className="mt-1.5 h-12" />
            </div>

            <Button type="submit" className="w-full font-body text-base h-12 rounded-xl">
              Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="flex flex-wrap gap-2 mt-6">
            <Badge variant="secondary" className="font-body text-xs">MFA Ready</Badge>
            <Badge variant="secondary" className="font-body text-xs">Audit Logged</Badge>
            <Badge variant="secondary" className="font-body text-xs">Session Control</Badge>
          </div>
        </motion.div>
      </div>

      {/* Right: Visual panel with role info */}
      <div className="hidden lg:block relative overflow-hidden">
        <img src={heroCity} alt="" className="absolute inset-0 w-full h-full object-cover" aria-hidden="true" />
        <div className="absolute inset-0 bg-primary/80 backdrop-blur-sm" />

        <div className="relative z-10 flex items-center justify-center h-full p-16">
          <motion.div
            key={selectedRole}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-md"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/10 mb-8">
              <Shield className="h-4 w-4 text-accent" />
              <span className="text-sm font-body text-white/80">Role-based access</span>
            </div>

            <h2 className="text-4xl font-display font-bold text-white mb-4">{currentRole.label}</h2>
            <p className="text-white/70 font-body text-lg leading-relaxed mb-8">{currentRole.description}</p>

            <div className="space-y-3 mb-10">
              {currentRole.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                  <span className="text-white/90 font-body">{feature}</span>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-white/10">
              <div className="flex items-center gap-8">
                {[
                  { value: "2.4M+", label: "Checks" },
                  { value: "99.9%", label: "Uptime" },
                  { value: "12", label: "Agencies" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-display font-bold text-accent">{stat.value}</p>
                    <p className="text-xs font-body text-white/50">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AppLogin;
