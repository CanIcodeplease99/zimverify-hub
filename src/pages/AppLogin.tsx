import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Eye, EyeOff, Lock, Users, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import heroCity from "@/assets/hero-city.jpg";

const roleDescriptions: Record<string, { label: string; description: string; icon: string }> = {
  public: { label: "Public User", description: "Self-service vehicle checks, purchase verification, and report downloads.", icon: "🏠" },
  police: { label: "Police Officer", description: "Field operations, stolen vehicle alerts, case management, and roadside checks.", icon: "🛡️" },
  government: { label: "Government Analyst", description: "Oversight dashboards, agency sync, audit trails, and system governance.", icon: "🏛️" },
  insurance: { label: "Insurance Officer", description: "Claims verification, fraud detection, risk assessment, and batch processing.", icon: "📋" },
  partner: { label: "Commercial Partner", description: "API access, bulk uploads, fleet verification, and usage analytics.", icon: "🤝" },
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
      <div className="flex items-center justify-center p-8 lg:p-16 bg-background">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-2xl text-foreground">ZimVerify</span>
          </div>

          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Sign in to ZimVerify</h1>
          <p className="text-muted-foreground font-body mb-8">Access the National Vehicle Verification Platform</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <Label className="font-body text-sm font-medium">Role</Label>
              <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as UserRole)}>
                <SelectTrigger className="mt-1.5 h-12 rounded-xl border-border/60 bg-card/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(roleDescriptions).map(([key, { label, icon }]) => (
                    <SelectItem key={key} value={key}>
                      <span className="flex items-center gap-2">
                        <span>{icon}</span> {label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="font-body text-sm font-medium">Email</Label>
              <Input type="email" placeholder="user@zimverify.gov.zw" className="mt-1.5 h-12 rounded-xl border-border/60 bg-card/50" defaultValue="demo@zimverify.gov.zw" />
            </div>

            <div>
              <Label className="font-body text-sm font-medium">Password</Label>
              <div className="relative mt-1.5">
                <Input type={showPassword ? "text" : "password"} className="h-12 rounded-xl border-border/60 bg-card/50 pr-10" defaultValue="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label className="font-body text-sm font-medium">OTP Code</Label>
              <Input placeholder="6-digit code" className="mt-1.5 h-12 rounded-xl border-border/60 bg-card/50" />
            </div>

            <Button type="submit" className="w-full font-body text-base h-12 rounded-xl shadow-md shadow-primary/20">
              Sign In <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="flex flex-wrap gap-2 mt-6">
            {[
              { icon: Lock, label: "MFA Ready" },
              { icon: Shield, label: "Audit Logged" },
              { icon: Users, label: "Session Control" },
            ].map((chip) => (
              <Badge key={chip.label} variant="secondary" className="font-body text-xs rounded-lg px-3 py-1 bg-card/80 border border-border/40">
                <chip.icon className="h-3 w-3 mr-1" />
                {chip.label}
              </Badge>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right: Hero image + role info */}
      <div className="hidden lg:block relative overflow-hidden">
        <img src={heroCity} alt="" className="absolute inset-0 w-full h-full object-cover" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-foreground/70" />
        <div className="relative z-10 h-full flex items-center justify-center p-16">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-md space-y-4"
          >
            <h2 className="text-2xl font-display font-bold text-white mb-6">Platform Access Roles</h2>
            {Object.entries(roleDescriptions).map(([key, { label, description, icon }]) => (
              <motion.div
                key={key}
                whileHover={{ x: 4 }}
                className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                  selectedRole === key
                    ? "bg-white/20 border-accent shadow-lg backdrop-blur-sm"
                    : "bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10"
                }`}
                onClick={() => setSelectedRole(key as UserRole)}
              >
                <h3 className="font-display font-semibold text-white flex items-center gap-2">
                  <span>{icon}</span> {label}
                </h3>
                <p className="text-sm text-white/70 font-body mt-1">{description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AppLogin;
