import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Eye, EyeOff, ChevronRight, ArrowLeft, Home, UserPlus, LogIn, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import heroCity from "@/assets/hero-city.jpg";

const AppLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const { login, loginWithEmail, signUpWithEmail, authMode, setAuthMode, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/app/public");
  }, [isAuthenticated, navigate]);

  const handleDemoLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login("PUBLIC_USER");
    navigate("/app/public");
  };

  const handleSupabaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Please enter email and password"); return; }
    const { error } = await loginWithEmail(email, password);
    if (error) toast.error("Login failed", { description: error });
    else toast.success("Welcome back!");
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) { toast.error("Please fill in all fields"); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    const { error, needsConfirmation } = await signUpWithEmail(email, password, fullName, "PUBLIC_USER");
    if (error) toast.error("Sign up failed", { description: error });
    else if (needsConfirmation) {
      toast.success("Account created!", { description: "Check your email for a confirmation link.", duration: 8000 });
      setIsSignUp(false);
    }
  };

  const isDemo = authMode === "demo";

  return (
    <div className="min-h-screen grid lg:grid-cols-2 relative">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="absolute top-6 left-6 z-20">
        <Button variant="ghost" onClick={() => navigate("/")} className="text-foreground hover:bg-muted gap-2 rounded-xl" data-testid="back-to-home-btn">
          <ArrowLeft className="h-4 w-4" /><span className="hidden sm:inline">Back to Home</span><Home className="h-4 w-4 sm:hidden" />
        </Button>
      </motion.div>

      <div className="flex items-center justify-center p-8 lg:p-16 bg-background pt-20">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-2xl text-foreground">ZimVerify</span>
          </div>

          <div className="flex gap-2 mb-6" data-testid="auth-mode-toggle">
            <Button variant={isDemo ? "default" : "outline"} size="sm" onClick={() => setAuthMode("demo")} className="font-body rounded-xl flex-1" data-testid="demo-mode-btn">Demo Mode</Button>
            <Button variant={!isDemo ? "default" : "outline"} size="sm" onClick={() => { setAuthMode("supabase"); setIsSignUp(false); }} className="font-body rounded-xl flex-1" data-testid="live-mode-btn">Live Login</Button>
          </div>

          {isDemo ? (
            <>
              <h1 className="text-3xl font-display font-bold text-foreground mb-2">Citizen Access</h1>
              <p className="text-muted-foreground font-body mb-8">Explore vehicle verification with demo data.</p>
              <form onSubmit={handleDemoLogin} className="space-y-5">
                <div><Label className="font-body text-sm font-medium">Email</Label><Input type="email" className="mt-1.5 h-12 rounded-xl border-border/60 bg-card/50" value="demo@zimverify.gov.zw" readOnly data-testid="demo-email-input" /></div>
                <div><Label className="font-body text-sm font-medium">Password</Label><Input type="password" className="mt-1.5 h-12 rounded-xl border-border/60 bg-card/50" value="demo1234" readOnly data-testid="demo-password-input" /></div>
                <Button type="submit" className="w-full font-body text-base h-12 rounded-xl shadow-md shadow-primary/20" data-testid="demo-login-btn">Enter Demo <ChevronRight className="ml-2 h-4 w-4" /></Button>
              </form>
              <p className="text-xs text-muted-foreground font-body mt-4 text-center">Demo mode uses mock data.</p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-display font-bold text-foreground mb-2">{isSignUp ? "Create Account" : "Citizen Sign In"}</h1>
              <p className="text-muted-foreground font-body mb-8">{isSignUp ? "Register for vehicle verification services" : "Access vehicle verification services"}</p>
              <form onSubmit={isSignUp ? handleSignUp : handleSupabaseLogin} className="space-y-5">
                {isSignUp && (<div><Label className="font-body text-sm font-medium">Full Name</Label><Input type="text" placeholder="Your full name" value={fullName} onChange={e => setFullName(e.target.value)} className="mt-1.5 h-12 rounded-xl border-border/60 bg-card/50" data-testid="signup-name-input" /></div>)}
                <div><Label className="font-body text-sm font-medium">Email</Label><Input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} className="mt-1.5 h-12 rounded-xl border-border/60 bg-card/50" data-testid="email-input" /></div>
                <div>
                  <Label className="font-body text-sm font-medium">Password</Label>
                  <div className="relative mt-1.5"><Input type={showPassword ? "text" : "password"} placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} className="h-12 rounded-xl border-border/60 bg-card/50 pr-10" data-testid="password-input" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
                </div>
                {!isSignUp && (<div className="text-right"><button type="button" onClick={() => navigate("/auth/reset-password")} className="text-sm text-primary font-body hover:underline" data-testid="forgot-password-link">Forgot password?</button></div>)}
                <Button type="submit" disabled={loading} className="w-full font-body text-base h-12 rounded-xl shadow-md shadow-primary/20" data-testid={isSignUp ? "signup-btn" : "login-btn"}>{loading ? "Please wait..." : isSignUp ? <><UserPlus className="mr-2 h-4 w-4" /> Create Account</> : <><LogIn className="mr-2 h-4 w-4" /> Sign In <ChevronRight className="ml-2 h-4 w-4" /></>}</Button>
              </form>
              <p className="text-sm text-muted-foreground font-body mt-6 text-center">{isSignUp ? <>Already have an account? <button onClick={() => setIsSignUp(false)} className="text-primary font-semibold hover:underline" data-testid="switch-to-login">Sign In</button></> : <>Don't have an account? <button onClick={() => setIsSignUp(true)} className="text-primary font-semibold hover:underline" data-testid="switch-to-signup">Sign Up</button></>}</p>
            </>
          )}

          <div className="flex flex-wrap gap-2 mt-6">
            {["Public Access", "Vehicle Checks", "Secure"].map(label => (
              <Badge key={label} variant="secondary" className="font-body text-xs rounded-lg px-3 py-1 bg-card/80 border border-border/40"><Shield className="h-3 w-3 mr-1" />{label}</Badge>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="hidden lg:block relative overflow-hidden">
        <img src={heroCity} alt="" className="absolute inset-0 w-full h-full object-cover" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-foreground/70" />
        <div className="relative z-10 h-full flex items-center justify-center p-16">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="max-w-md space-y-6">
            <h2 className="text-3xl font-display font-bold text-white">Vehicle Verification for Everyone</h2>
            <p className="text-white/80 font-body text-lg leading-relaxed">Check any vehicle's registration, ownership history, and legal status instantly.</p>
            <div className="space-y-3">
              {["Instant plate & VIN lookups", "Ownership verification reports", "Stolen vehicle alerts", "Digital receipts & history"].map(item => (
                <div key={item} className="flex items-center gap-3 text-white/90 font-body"><Search className="h-4 w-4 text-accent shrink-0" /><span>{item}</span></div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AppLogin;
