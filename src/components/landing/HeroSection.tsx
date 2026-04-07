import { motion } from "framer-motion";
import { Shield, Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-20 left-10 w-72 h-72 rounded-full bg-accent/10 blur-3xl" />

      <div className="container relative z-10 mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-semibold font-body">National Vehicle Verification</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-display font-bold tracking-tight text-foreground leading-[1.1] mb-6">
              Zim<span className="text-primary">Verify</span>
            </h1>

            <p className="text-xl lg:text-2xl font-body text-muted-foreground leading-relaxed mb-4 max-w-lg">
              Zimbabwe's National Vehicle Information & Verification Platform
            </p>

            <p className="text-base font-body text-muted-foreground mb-8 max-w-md">
              Instantly verify vehicle registration, ownership, and legal status. Trusted by law enforcement, insurers, and citizens.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="text-lg px-8 py-6 font-body"
                onClick={() => navigate("/app/login")}
              >
                Get Started
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 font-body"
                onClick={() => navigate("/app/login")}
              >
                <Search className="mr-2 h-5 w-5" />
                Run a Check
              </Button>
            </div>

            <div className="flex items-center gap-6 mt-10">
              {[
                { label: "Checks performed", value: "2.4M+" },
                { label: "Agencies connected", value: "12" },
                { label: "Uptime", value: "99.9%" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-display font-bold text-primary">{stat.value}</p>
                  <p className="text-xs font-body text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="bg-card rounded-2xl border shadow-2xl p-8 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <div className="w-3 h-3 rounded-full bg-success" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-background border">
                    <Search className="h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground font-body">ABC 1234 ZW</span>
                  </div>

                  <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-success" />
                      <span className="font-semibold text-success font-body text-sm">CLEAR — No issues found</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-body">2024 Toyota Hilux • Registered in Harare</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {["Registration ✓", "Ownership ✓", "Stolen Check ✓", "Licence ✓"].map((item) => (
                      <div key={item} className="bg-muted/50 rounded-lg p-3 text-center">
                        <span className="text-xs font-body text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-primary/5 rounded-2xl -z-10" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
