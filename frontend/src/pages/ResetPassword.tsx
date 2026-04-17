import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, ArrowLeft, Mail, Lock, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

type Step = "request" | "sent" | "reset";

const ResetPassword = () => {
  const [step, setStep] = useState<Step>(() => {
    // If URL has hash with access_token, we're in reset mode
    const hash = window.location.hash;
    return hash.includes("access_token") ? "reset" : "request";
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    setLoading(false);

    if (error) {
      toast.error("Failed to send reset email", { description: error.message });
    } else {
      setStep("sent");
      toast.success("Reset email sent!");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toast.error("Failed to reset password", { description: error.message });
    } else {
      toast.success("Password updated successfully!");
      setTimeout(() => navigate("/app/login"), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <Button
          variant="ghost"
          onClick={() => navigate("/app/login")}
          className="mb-6 text-foreground hover:bg-muted gap-2 rounded-xl"
          data-testid="back-to-login-btn"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Login
        </Button>

        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-2xl text-foreground">ZimVerify</span>
        </div>

        {step === "request" && (
          <>
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">Reset Password</h1>
            <p className="text-muted-foreground font-body mb-8">
              Enter your email and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleRequestReset} className="space-y-5">
              <div>
                <Label className="font-body text-sm font-medium">Email</Label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 h-12 rounded-xl border-border/60 bg-card/50"
                  data-testid="reset-email-input"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full font-body text-base h-12 rounded-xl shadow-md shadow-primary/20"
                data-testid="send-reset-btn"
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                ) : (
                  <><Mail className="mr-2 h-4 w-4" /> Send Reset Link</>
                )}
              </Button>
            </form>
          </>
        )}

        {step === "sent" && (
          <div className="text-center space-y-4" data-testid="reset-email-sent">
            <Mail className="h-16 w-16 text-primary mx-auto" />
            <h2 className="text-2xl font-display font-bold text-foreground">Check your email</h2>
            <p className="text-muted-foreground font-body">
              We've sent a password reset link to <strong>{email}</strong>. Click the link in the email to reset your password.
            </p>
            <p className="text-sm text-muted-foreground/60 font-body">
              Didn't receive the email? Check your spam folder or{" "}
              <button
                onClick={() => setStep("request")}
                className="text-primary font-semibold hover:underline"
              >
                try again
              </button>.
            </p>
          </div>
        )}

        {step === "reset" && (
          <>
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">New Password</h1>
            <p className="text-muted-foreground font-body mb-8">
              Enter your new password below.
            </p>

            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <Label className="font-body text-sm font-medium">New Password</Label>
                <Input
                  type="password"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5 h-12 rounded-xl border-border/60 bg-card/50"
                  data-testid="new-password-input"
                />
              </div>

              <div>
                <Label className="font-body text-sm font-medium">Confirm Password</Label>
                <Input
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1.5 h-12 rounded-xl border-border/60 bg-card/50"
                  data-testid="confirm-password-input"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full font-body text-base h-12 rounded-xl shadow-md shadow-primary/20"
                data-testid="update-password-btn"
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</>
                ) : (
                  <><Lock className="mr-2 h-4 w-4" /> Update Password</>
                )}
              </Button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;
