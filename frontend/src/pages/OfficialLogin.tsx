import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Eye, EyeOff, ChevronRight, ArrowLeft, UserPlus, LogIn, Lock, ShieldCheck, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import heroCity from "@/assets/hero-city.jpg";

const officialRoles: Record<string, { label: string; description: string; icon: string }> = {
  police: { label: "Police Officer", description: "Field operations, stolen vehicle alerts, Interpol verification.", icon: "🛡️" },
  government: { label: "Government Analyst", description: "Oversight dashboards, audit trails, system governance.", icon: "🏛️" },
  customs: { label: "Customs Officer (ZIMRA)", description: "Import vehicle data, border entry management.", icon: "🚚" },
  insurance: { label: "Insurance Officer", description: "Claims verification, fraud detection, risk assessment.", icon: "📋" },
  partner: { label: "Commercial Partner", description: "API access, bulk uploads, fleet verification.", icon: "🤝" },
};

const roleDashboardRoutes: Record<UserRole, string> = {
  public: "/app/public",
  police: "/app/police",
  government: "/app/government",
  insurance: "/app/insurance",
  partner: "/app/partners",
  customs: "/app/customs",
};

const OfficialLogin = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>("police");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const { login, loginWithEmail, signUpWithEmail, authMode, setAuthMode, loading, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && role !== "public") {
      navigate(roleDashboardRoutes[role] || "/app/government");
    }
  }, [isAuthenticated, role, navigate]);

  const handleDemoLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole);
    navigate(roleDashboardRoutes[selectedRole]);
  };

  const handleSupabaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Please enter your credentials"); return; }
    const { error } = await loginWithEmail(email, password);
    if (error) toast.error("Authentication failed", { description: error });
    else toast.success("Authenticated successfully");
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) { toast.error("All fields are required"); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    const { error, needsConfirmation } = await signUpWithEmail(email, password, fullName, selectedRole);
    if (error) toast.error("Registration failed", { description: error });
    else if (needsConfirmation) {
      toast.success("Registration submitted", { description: "Check your email for verification. Your role will be reviewed by an administrator.", duration: 8000 });
      setIsSignUp(false);
    }
  };

  const isDemo = authMode === "demo";

  return (
    <div className="min-h-screen grid lg:grid-cols-2 relative">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="absolute top-6 left-6 z-20">
        <Button variant="ghost" onClick={() => navigate("/app/login")} className="text-foreground hover:bg-muted gap-2 rounded-xl" data-testid="back-to-public-btn">
          <ArrowLeft className="h-4 w-4" /><span className="hidden sm:inline">Public Login</span>
        </Button>
      </motion.div>

      <div className="flex items-center justify-center p-8 lg:p-16 bg-background pt-20">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-display font-bold text-2xl text-foreground">ZimVerify</span>
              <Badge variant="outline" className="ml-2 text-xs font-body bg-destructive/10 text-destructive border-destructive/20">Official Portal</Badge>
            </div>
          </div>
          <p className="text-xs text-muted-foreground font-body mb-6 flex items-center gap-1.5">
            <Lock className="h-3 w-3" /> Restricted access — authorized personnel only
          </p>

          <div className="flex gap-2 mb-6" data-testid="auth-mode-toggle">
            <Button variant={isDemo ? "default" : "outline"} size="sm" onClick={() => setAuthMode("demo")} className="font-body rounded-xl flex-1" data-testid="demo-mode-btn">
              Demo Mode
            </Button>
            <Button variant={!isDemo ? "default" : "outline"} size="sm" onClick={() => { setAuthMode("supabase"); setIsSignUp(false); }} className="font-body rounded-xl flex-1" data-testid="live-mode-btn">
              Secure Login
            </Button>
          </div>

          {isDemo ? (
            <>
              <h1 className="text-3xl font-display font-bold text-foreground mb-2">Official Demo</h1>
              <p className="text-muted-foreground font-body mb-6">Select your department to explore the platform.</p>
              <form onSubmit={handleDemoLogin} className="space-y-5">
                <div>
                  <Label className="font-body text-sm font-medium">Department / Role</Label>
                  <Select value={selectedRole} onValueChange={v => setSelectedRole(v as UserRole)}>
                    <SelectTrigger className="mt-1.5 h-12 rounded-xl border-border/60 bg-card/50" data-testid="official-role-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(officialRoles).map(([key, { label, icon }]) => (
                        <SelectItem key={key} value={key}>
                          <span className="flex items-center gap-2"><span>{icon}</span> {label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-body text-sm font-medium">Officer ID / Email</Label>
                  <Input type="email" className="mt-1.5 h-12 rounded-xl border-border/60 bg-card/50" value="officer@zimverify.gov.zw" readOnly data-testid="demo-email-input" />
                </div>
                <div>
                  <Label className="font-body text-sm font-medium">Password</Label>
                  <Input type="password" className="mt-1.5 h-12 rounded-xl border-border/60 bg-card/50" value="secured123" readOnly data-testid="demo-password-input" />
                </div>
                <Button type="submit" className="w-full font-body text-base h-12 rounded-xl shadow-md shadow-primary/20" data-testid="demo-login-btn">
                  Enter Demo Console <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-display font-bold text-foreground mb-2">{isSignUp ? "Request Access" : "Official Sign In"}</h1>
              <p className="text-muted-foreground font-body mb-6">{isSignUp ? "Submit registration for official portal access" : "Authenticate with your official credentials"}</p>
              <form onSubmit={isSignUp ? handleSignUp : handleSupabaseLogin} className="space-y-5">
                {isSignUp && (
                  <>
                    <div>
                      <Label className="font-body text-sm font-medium">Full Name & Rank</Label>
                      <Input type="text" placeholder="e.g. Insp. T. Ncube" value={fullName} onChange={e => setFullName(e.target.value)} className="mt-1.5 h-12 rounded-xl border-border/60 bg-card/50" data-testid="signup-name-input" />
                    </div>
                    <div>
                      <Label className="font-body text-sm font-medium">Department</Label>
                      <Select value={selectedRole} onValueChange={v => setSelectedRole(v as UserRole)}>
                        <SelectTrigger className="mt-1.5 h-12 rounded-xl border-border/60 bg-card/50" data-testid="signup-role-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(officialRoles).map(([key, { label, icon }]) => (
                            <SelectItem key={key} value={key}>
                              <span className="flex items-center gap-2"><span>{icon}</span> {label}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
                <div>
                  <Label className="font-body text-sm font-medium">Official Email</Label>
                  <Input type="email" placeholder="you@gov.zw" value={email} onChange={e => setEmail(e.target.value)} className="mt-1.5 h-12 rounded-xl border-border/60 bg-card/50" data-testid="email-input" />
                </div>
                <div>
                  <Label className="font-body text-sm font-medium">Password</Label>
                  <div className="relative mt-1.5">
                    <Input type={showPassword ? "text" : "password"} placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} className="h-12 rounded-xl border-border/60 bg-card/50 pr-10" data-testid="password-input" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                {!isSignUp && (
                  <div className="text-right">
                    <button type="button" onClick={() => navigate("/auth/reset-password")} className="text-sm text-primary font-body hover:underline" data-testid="forgot-password-link">Forgot password?</button>
                  </div>
                )}
                <Button type="submit" disabled={loading} className="w-full font-body text-base h-12 rounded-xl shadow-md shadow-primary/20" data-testid={isSignUp ? "signup-btn" : "login-btn"}>
                  {loading ? "Authenticating..." : isSignUp ? <><UserPlus className="mr-2 h-4 w-4" /> Request Access</> : <><LogIn className="mr-2 h-4 w-4" /> Authenticate</>}
                </Button>
              </form>
              <p className="text-sm text-muted-foreground font-body mt-6 text-center">
                {isSignUp ? <>Already registered? <button onClick={() => setIsSignUp(false)} className="text-primary font-semibold hover:underline" data-testid="switch-to-login">Sign In</button></> : <>Need access? <button onClick={() => setIsSignUp(true)} className="text-primary font-semibold hover:underline" data-testid="switch-to-signup">Request Access</button></>}
              </p>
            </>
          )}

          <div className="flex flex-wrap gap-2 mt-6">
            {[{ icon: Lock, label: "Encrypted" }, { icon: Fingerprint, label: "MFA Ready" }, { icon: ShieldCheck, label: "Audit Logged" }].map(chip => (
              <Badge key={chip.label} variant="secondary" className="font-body text-xs rounded-lg px-3 py-1 bg-card/80 border border-border/40">
                <chip.icon className="h-3 w-3 mr-1" />{chip.label}
              </Badge>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right: Official branding */}
      <div className="hidden lg:block relative overflow-hidden">
        <img src={heroCity} alt="" className="absolute inset-0 w-full h-full object-cover" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a2e26]/95 via-[#0d3d35]/90 to-foreground/80" />
        <div className="relative z-10 h-full flex items-center justify-center p-16">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="max-w-md space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 mb-4">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span className="text-xs text-white/80 font-body font-semibold uppercase tracking-wider">Authorized Access Only</span>
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-6">Official Portal Roles</h2>
            {Object.entries(officialRoles).map(([key, { label, description, icon }]) => (
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

export default OfficialLogin;
