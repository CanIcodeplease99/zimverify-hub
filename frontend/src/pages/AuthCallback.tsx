import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

type Status = "loading" | "success" | "error";

const AuthCallback = () => {
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Supabase handles the token exchange automatically when the URL has the hash fragments
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          setStatus("error");
          setMessage(error.message);
          return;
        }

        if (data.session) {
          setStatus("success");
          setMessage("Your email has been confirmed. Redirecting to your dashboard...");
          setTimeout(() => navigate("/app/public"), 2000);
        } else {
          // Check URL hash for type
          const hash = window.location.hash;
          const params = new URLSearchParams(hash.replace("#", "?"));
          const type = params.get("type");

          if (type === "recovery") {
            // Password recovery - redirect to reset page
            navigate("/auth/reset-password" + window.location.hash);
            return;
          }

          setStatus("success");
          setMessage("Email confirmed! You can now sign in.");
        }
      } catch {
        setStatus("error");
        setMessage("Something went wrong during confirmation.");
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-2xl text-foreground">ZimVerify</span>
        </div>

        {status === "loading" && (
          <div className="space-y-4" data-testid="auth-callback-loading">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <h2 className="text-2xl font-display font-bold text-foreground">Confirming your email...</h2>
            <p className="text-muted-foreground font-body">Please wait while we verify your account.</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4" data-testid="auth-callback-success">
            <CheckCircle className="h-16 w-16 text-success mx-auto" />
            <h2 className="text-2xl font-display font-bold text-foreground">Email Confirmed!</h2>
            <p className="text-muted-foreground font-body">{message}</p>
            <Button
              onClick={() => navigate("/app/login")}
              className="font-body rounded-xl mt-4"
              data-testid="go-to-login-btn"
            >
              Go to Login
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4" data-testid="auth-callback-error">
            <XCircle className="h-16 w-16 text-destructive mx-auto" />
            <h2 className="text-2xl font-display font-bold text-foreground">Confirmation Failed</h2>
            <p className="text-muted-foreground font-body">{message}</p>
            <div className="flex gap-3 justify-center mt-4">
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="font-body rounded-xl"
              >
                Go Home
              </Button>
              <Button
                onClick={() => navigate("/app/login")}
                className="font-body rounded-xl"
              >
                Try Login
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AuthCallback;
