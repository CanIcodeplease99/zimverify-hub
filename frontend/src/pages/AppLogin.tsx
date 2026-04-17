import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Eye, EyeOff, ChevronRight, ArrowLeft, Home, UserPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import heroCity from "@/assets/hero-city.jpg";

const roleDescriptions: Record<string, { label: string; description: string; icon: string }> = {
  public: { label: "Public User", description: "Self-service vehicle checks, purchase verification, and report downloads.", icon: "🏠" },
  police: { label: "Police Officer", description: "Field operations, stolen vehicle alerts, Interpol verification, and roadside checks.", icon: "🛡️" },
  government: { label: "Government Analyst", description: "Oversight dashboards, agency sync, audit trails, and system governance.", icon: "🏛️" },
  insurance: { label: "Insurance Officer", description: "Claims verification, fraud detection, risk assessment, and batch processing.", icon: "📋" },
  partner: { label: "Commercial Partner", description: "API access, bulk uploads, fleet verification, and usage analytics.", icon: "🤝" },
  customs: { label: "Customs Officer (ZIMRA)", description: "Input imported vehicle data, manage border entries, source of truth for imports.", icon: "🚚" },
};

const roleDashboardRoutes: Record<UserRole, string> = {
  public: "/app/public",
  police: "/app/police",
  government: "/app/government",
  insurance: "/app/insurance",
  partner: "/app/partners",
  customs: "/app/customs",
};

const AppLogin = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>("public");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const { login, loginWithEmail, signUpWithEmail, authMode, setAuthMode, loading, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(roleDashboardRoutes[role] || "/app/public");
    }
  }, [isAuthenticated, role, navigate]);

  const handleDemoLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole);
    navigate(roleDashboardRoutes[selectedRole]);
  };

  const handleSupabaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    const { error } = await loginWithEmail(email, password);
    if (error) {
      toast.error("Login failed", { description: error });
    } else {
      toast.success("Welcome back!");
      // The useEffect above will redirect once isAuthenticated becomes true
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    const { error, needsConfirmation } = await signUpWithEmail(email, password, fullName, selectedRole);
    if (error) {
      toast.error("Sign up failed", { description: error });
    } else if (needsConfirmation) {
      toast.success("Account created!", {
        description: "Check your email for a confirmation link.",
        duration: 8000,
      });
      setIsSignUp(false);
    }
  };

  const isDemo = authMode === "demo";

  return (
    <div className="min-h-screen grid lg:grid-cols-2 relative">
      {/* Back to Home */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-6 left-6 z-20"
      >
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="text-foreground hover:bg-muted gap-2 rounded-xl"
          data-testid="back-to-home-btn"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back to Home</span>
          <Home className="h-4 w-4 sm:hidden" />
        </Button>
      </motion.div>

      {/* Left: Login form */}
      <div className="flex items-center justify-center p-8 lg:p-16 bg-background pt-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-2xl text-foreground">ZimVerify</span>
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-2 mb-6" data-testid="auth-mode-toggle">
            <Button
              variant={isDemo ? "default" : "outline"}
              size="sm"
              onClick={() => setAuthMode("demo")}
              className="font-body rounded-xl flex-1"
              data-testid="demo-mode-btn"
            >
              Demo Mode
            </Button>
            <Button
              variant={!isDemo ? "default" : "outline"}
              size="sm"
              onClick={() => { setAuthMode("supabase"); setIsSignUp(false); }}
              className="font-body rounded-xl flex-1"
              data-testid="live-mode-btn"
            >
              Live Login
            </Button>
          </div>

          {isDemo ? (
            <>
              <h1 className="text-3xl font-display font-bold text-foreground mb-2">Demo Access</h1>
              <p className="text-muted-foreground font-body mb-8">
                Select a role to explore the platform with mock data.
              </p>

              <form onSubmit={handleDemoLogin} className="space-y-5">
                <div>
                  <Label className="font-body text-sm font-medium">Role</Label>
                  <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as UserRole)}>
                    <SelectTrigger className="mt-1.5 h-12 rounded-xl border-border/60 bg-card/50" data-testid="demo-role-select">
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
                  <Input
                    type="email"
                    placeholder="user@zimverify.gov.zw"
                    className="mt-1.5 h-12 rounded-xl border-border/60 bg-card/50"
                    defaultValue="demo@zimverify.gov.zw"
                    data-testid="demo-email-input"
                  />
                </div>

                <div>
                  <Label className="font-body text-sm font-medium">Password</Label>
                  <div className="relative mt-1.5">
                    <Input
                      type={showPassword ? "text" : "password"}
                      className="h-12 rounded-xl border-border/60 bg-card/50 pr-10"
                      defaultValue="demo1234"
                      data-testid="demo-password-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full font-body text-base h-12 rounded-xl shadow-md shadow-primary/20"
                  data-testid="demo-login-btn"
                >
                  Enter Demo <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              <p className="text-xs text-muted-foreground font-body mt-4 text-center">
                Demo mode uses mock data. Switch to "Live Login" for real authentication.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                {isSignUp ? "Create Account" : "Sign In"}
              </h1>
              <p className="text-muted-foreground font-body mb-8">
                {isSignUp
                  ? "Register for the National Vehicle Verification Platform"
                  : "Access the National Vehicle Verification Platform"}
              </p>

              <form
                onSubmit={isSignUp ? handleSignUp : handleSupabaseLogin}
                className="space-y-5"
              >
                {isSignUp && (
                  <div>
                    <Label className="font-body text-sm font-medium">Full Name</Label>
                    <Input
                      type="text"
                      placeholder="Your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="mt-1.5 h-12 rounded-xl border-border/60 bg-card/50"
                      data-testid="signup-name-input"
                    />
                  </div>
                )}

                <div>
                  <Label className="font-body text-sm font-medium">Email</Label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1.5 h-12 rounded-xl border-border/60 bg-card/50"
                    data-testid="email-input"
                  />
                </div>

                <div>
                  <Label className="font-body text-sm font-medium">Password</Label>
                  <div className="relative mt-1.5">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 rounded-xl border-border/60 bg-card/50 pr-10"
                      data-testid="password-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {!isSignUp && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => navigate("/auth/reset-password")}
                      className="text-sm text-primary font-body hover:underline"
                      data-testid="forgot-password-link"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {isSignUp && (
                  <div>
                    <Label className="font-body text-sm font-medium">Role</Label>
                    <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as UserRole)}>
                      <SelectTrigger className="mt-1.5 h-12 rounded-xl border-border/60 bg-card/50" data-testid="signup-role-select">
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
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full font-body text-base h-12 rounded-xl shadow-md shadow-primary/20"
                  data-testid={isSignUp ? "signup-btn" : "login-btn"}
                >
                  {loading ? (
                    "Please wait..."
                  ) : isSignUp ? (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" /> Create Account
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" /> Sign In <ChevronRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <p className="text-sm text-muted-foreground font-body mt-6 text-center">
                {isSignUp ? (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={() => setIsSignUp(false)}
                      className="text-primary font-semibold hover:underline"
                      data-testid="switch-to-login"
                    >
                      Sign In
                    </button>
                  </>
                ) : (
                  <>
                    Don't have an account?{" "}
                    <button
                      onClick={() => setIsSignUp(true)}
                      className="text-primary font-semibold hover:underline"
                      data-testid="switch-to-signup"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </p>
            </>
          )}

          <div className="flex flex-wrap gap-2 mt-6">
            {[
              { label: "Supabase Auth" },
              { label: "RLS Protected" },
              { label: "Role-Based Access" },
            ].map((chip) => (
              <Badge
                key={chip.label}
                variant="secondary"
                className="font-body text-xs rounded-lg px-3 py-1 bg-card/80 border border-border/40"
              >
                <Shield className="h-3 w-3 mr-1" />
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
