import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ChevronRight, Search, CheckCircle2, Loader2, Car, FileText, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroCity from "@/assets/hero-city.jpg";

const demoSteps = [
  { phase: "typing", label: "Enter plate number" },
  { phase: "searching", label: "Searching databases..." },
  { phase: "result", label: "Report ready" },
];

const HeroSection = () => {
  const navigate = useNavigate();
  const [demoStep, setDemoStep] = useState(0);
  const [typedText, setTypedText] = useState("");
  const plateNumber = "ABC 1234 ZW";

  // Fixed cycling - runs continuously but doesn't cause page refresh
  useEffect(() => {
    let isMounted = true;
    
    const runCycle = () => {
      if (!isMounted) return;
      
      setDemoStep(0);
      setTypedText("");

      // Typing phase
      let charIdx = 0;
      const typeInterval = setInterval(() => {
        if (!isMounted) {
          clearInterval(typeInterval);
          return;
        }
        
        if (charIdx < plateNumber.length) {
          setTypedText(plateNumber.slice(0, charIdx + 1));
          charIdx++;
        } else {
          clearInterval(typeInterval);
          // Move to searching
          setTimeout(() => {
            if (!isMounted) return;
            setDemoStep(1);
            // Move to result
            setTimeout(() => {
              if (!isMounted) return;
              setDemoStep(2);
              // Reset after showing result - restart cycle
              setTimeout(() => {
                if (isMounted) runCycle();
              }, 3000);
            }, 2000);
          }, 800);
        }
      }, 120);
    };

    runCycle();
    
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency - only set up once

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Full-bleed hero image with overlay */}
      <div className="absolute inset-0">
        <img
          src={heroCity}
          alt="Aerial view of Zimbabwe cityscape at golden hour"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-foreground/20" />
      </div>

      <div className="relative z-10 container mx-auto px-6 pt-32 pb-20 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-12 gap-12 items-center w-full">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm mb-8"
            >
              <Shield className="h-4 w-4 text-accent" />
              <span className="text-sm font-body font-medium text-white/90 tracking-wide uppercase">
                National Vehicle Verification Platform
              </span>
            </motion.div>

            <h1 className="font-display font-bold text-white leading-[0.95] mb-8">
              <span className="block text-6xl lg:text-8xl xl:text-9xl">Zim</span>
              <span className="block text-6xl lg:text-8xl xl:text-9xl text-accent">Verify</span>
            </h1>

            <p className="text-xl lg:text-2xl font-body text-white/80 leading-relaxed max-w-xl mb-10 font-light">
              Instantly verify any vehicle's registration, ownership, and legal status — 
              trusted by law enforcement, insurers, and 14 million citizens.
            </p>

            <div className="flex flex-wrap gap-4 mb-14">
              <Button
                size="lg"
                className="text-lg px-10 py-7 font-body bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl shadow-lg shadow-accent/25"
                onClick={() => navigate("/app/login")}
              >
                Access Platform
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                className="text-lg px-10 py-7 font-body bg-white/15 border border-white/25 text-white hover:bg-white/25 rounded-xl backdrop-blur-sm"
                onClick={() => navigate("/app/login")}
              >
                <Search className="mr-2 h-5 w-5" />
                Run a Vehicle Check
              </Button>
            </div>

            {/* Stats strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex items-center gap-10 lg:gap-14"
            >
              {[
                { value: "2.4M+", label: "Checks performed" },
                { value: "12", label: "Agencies connected" },
                { value: "99.9%", label: "Platform uptime" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl lg:text-4xl font-display font-bold text-accent">{stat.value}</p>
                  <p className="text-sm font-body text-white/60 mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — Interactive demo card */}
          <motion.div
            initial={{ opacity: 0, y: 60, rotateY: -5 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 hidden lg:block"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-accent/20 rounded-3xl blur-2xl" />
              
              <div className="relative bg-card/95 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl overflow-hidden">
                {/* Card header */}
                <div className="px-8 py-5 border-b border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="font-display font-semibold text-foreground">Live Demo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {demoSteps.map((step, i) => (
                      <div
                        key={i}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                          i <= demoStep ? "bg-success scale-110" : "bg-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Step indicator */}
                <div className="px-8 pt-4 flex items-center gap-3">
                  <div className="flex items-center gap-2 text-xs font-body text-muted-foreground">
                    {demoSteps.map((step, i) => (
                      <span
                        key={i}
                        className={`px-2 py-1 rounded-md transition-all duration-300 ${
                          demoStep === i
                            ? "bg-primary/10 text-primary font-semibold"
                            : i < demoStep
                            ? "text-success"
                            : "text-muted-foreground/40"
                        }`}
                      >
                        {i < demoStep ? "✓" : `${i + 1}.`} {step.label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Search bar */}
                <div className="px-8 pt-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-background border border-border">
                    <Search className="h-5 w-5 text-muted-foreground" />
                    <span className="font-body text-foreground flex-1">
                      {typedText}
                      {demoStep === 0 && (
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                          className="inline-block w-0.5 h-5 bg-primary ml-0.5 align-middle"
                        />
                      )}
                    </span>
                    <motion.div
                      animate={demoStep === 1 ? { rotate: 360 } : {}}
                      transition={demoStep === 1 ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
                    >
                      {demoStep === 1 ? (
                        <Loader2 className="h-5 w-5 text-primary" />
                      ) : (
                        <Search className="h-5 w-5 text-primary" />
                      )}
                    </motion.div>
                  </div>
                </div>

                {/* Result area */}
                <div className="px-8 py-5 min-h-[280px]">
                  <AnimatePresence mode="wait">
                    {demoStep === 0 && (
                      <motion.div
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                          <Car className="h-4 w-4 text-muted-foreground/40" />
                          <div className="flex-1 space-y-2">
                            <div className="h-3 w-3/4 bg-muted rounded" />
                            <div className="h-2 w-1/2 bg-muted/60 rounded" />
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                          <FileText className="h-4 w-4 text-muted-foreground/40" />
                          <div className="flex-1 space-y-2">
                            <div className="h-3 w-2/3 bg-muted rounded" />
                            <div className="h-2 w-1/3 bg-muted/60 rounded" />
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                          <AlertTriangle className="h-4 w-4 text-muted-foreground/40" />
                          <div className="flex-1 space-y-2">
                            <div className="h-3 w-1/2 bg-muted rounded" />
                            <div className="h-2 w-2/5 bg-muted/60 rounded" />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {demoStep === 1 && (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3"
                      >
                        {["CVR Database", "ZRP Stolen Registry", "ZINARA Licensing", "Insurance Council"].map((db, i) => (
                          <motion.div
                            key={db}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.3 }}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                          >
                            <span className="text-sm font-body text-muted-foreground">{db}</span>
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: i * 0.3 + 0.4 }}
                            >
                              <CheckCircle2 className="h-4 w-4 text-success" />
                            </motion.div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}

                    {demoStep === 2 && (
                      <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="bg-success/10 border border-success/20 rounded-xl p-5 mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="h-5 w-5 text-success" />
                            <span className="font-semibold text-success font-body">CLEAR — No issues found</span>
                          </div>
                          <p className="text-sm text-muted-foreground font-body">2024 Toyota Hilux • Single owner • Harare</p>
                        </div>

                        <div className="space-y-2.5">
                          {[
                            { label: "Registration", status: "Valid", icon: FileText },
                            { label: "Stolen Check", status: "Clear", icon: Shield },
                            { label: "Insurance", status: "Active", icon: CheckCircle2 },
                            { label: "Odometer", status: "OK", icon: Car },
                          ].map((item, i) => (
                            <motion.div
                              key={item.label}
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-muted/30 transition-colors border-b border-border/30 last:border-0"
                            >
                              <span className="text-sm font-body text-muted-foreground flex items-center gap-2">
                                <item.icon className="h-3.5 w-3.5" />
                                {item.label}
                              </span>
                              <span className="text-sm font-body font-semibold text-success flex items-center gap-1">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                {item.status}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default HeroSection;
