import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Shield, ChevronRight, Search, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroCity from "@/assets/hero-city.jpg";

const typewriterPlates = ["ABC 1234 ZW", "HRE 9981 ZW", "BYO 4456 ZW"];

const verificationSteps = [
  { label: "Registration Status", status: "Valid", delay: 0.6 },
  { label: "Ownership History", status: "1 owner", delay: 1.2 },
  { label: "Stolen Check", status: "Clear", delay: 1.8 },
  { label: "Insurance Status", status: "Active", delay: 2.4 },
];

const HeroSection = () => {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState("");
  const [plateIndex, setPlateIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [revealedSteps, setRevealedSteps] = useState(0);

  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 800], [0, 200]);
  const contentY = useTransform(scrollY, [0, 600], [0, -60]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0.3]);

  // Typewriter + search animation loop
  useEffect(() => {
    const plate = typewriterPlates[plateIndex];
    let charIndex = 0;
    setTypedText("");
    setIsSearching(false);
    setShowResult(false);
    setRevealedSteps(0);

    const typeTimer = setInterval(() => {
      charIndex++;
      setTypedText(plate.slice(0, charIndex));
      if (charIndex >= plate.length) {
        clearInterval(typeTimer);
        // Start "searching"
        setTimeout(() => {
          setIsSearching(true);
          setTimeout(() => {
            setIsSearching(false);
            setShowResult(true);
            // Reveal steps one by one
            let step = 0;
            const stepTimer = setInterval(() => {
              step++;
              setRevealedSteps(step);
              if (step >= verificationSteps.length) {
                clearInterval(stepTimer);
                // Wait then restart with next plate
                setTimeout(() => {
                  setPlateIndex((prev) => (prev + 1) % typewriterPlates.length);
                }, 3000);
              }
            }, 500);
          }, 1200);
        }, 400);
      }
    }, 80);

    return () => clearInterval(typeTimer);
  }, [plateIndex]);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Parallax background */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <img
          src={heroCity}
          alt="Aerial view of Zimbabwe cityscape at golden hour"
          className="w-full h-full object-cover scale-110"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-foreground/20" />
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity }}
        className="relative z-10 container mx-auto px-6 pt-32 pb-20 min-h-screen flex items-center"
      >
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

          {/* Right — interactive verification card */}
          <motion.div
            initial={{ opacity: 0, y: 60, rotateY: -5 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 hidden lg:block"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-accent/20 rounded-3xl blur-2xl animate-pulse" />

              <div className="relative bg-card/95 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl overflow-hidden">
                {/* Card header */}
                <div className="px-8 py-5 border-b border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="font-display font-semibold text-foreground">Live Demo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <span className="text-xs font-body text-muted-foreground">Real-time</span>
                  </div>
                </div>

                {/* Animated search bar */}
                <div className="px-8 pt-6">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-background border border-border">
                    <Search className="h-5 w-5 text-muted-foreground" />
                    <span className="font-body text-foreground font-medium">
                      {typedText}
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6 }}
                        className="inline-block w-0.5 h-5 bg-primary ml-0.5 align-middle"
                      />
                    </span>
                  </div>
                </div>

                {/* Loading state */}
                {isSearching && (
                  <div className="px-8 py-8 flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    <p className="text-sm font-body text-muted-foreground">Querying national databases...</p>
                    <div className="w-full space-y-2 mt-2">
                      {["CVR Registry", "ZRP Database", "ZINARA Records"].map((db, i) => (
                        <motion.div
                          key={db}
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ delay: i * 0.3, duration: 0.8 }}
                          className="flex items-center gap-2"
                        >
                          <div className="h-1.5 flex-1 bg-primary/20 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: "0%" }}
                              animate={{ width: "100%" }}
                              transition={{ delay: i * 0.3, duration: 0.8 }}
                              className="h-full bg-primary rounded-full"
                            />
                          </div>
                          <span className="text-xs font-body text-muted-foreground whitespace-nowrap">{db}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Result */}
                {showResult && !isSearching && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-8 py-5"
                  >
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-success/10 border border-success/20 rounded-xl p-5 mb-5"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-5 w-5 text-success" />
                        <span className="font-semibold text-success font-body">CLEAR — No issues found</span>
                      </div>
                      <p className="text-sm text-muted-foreground font-body">2024 Toyota Hilux • Single owner • Harare</p>
                    </motion.div>

                    <div className="space-y-3">
                      {verificationSteps.map((item, i) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, x: -10 }}
                          animate={i < revealedSteps ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
                        >
                          <span className="text-sm font-body text-muted-foreground">{item.label}</span>
                          <span className="text-sm font-body font-semibold text-success flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            {item.status}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Placeholder when not searching yet */}
                {!isSearching && !showResult && (
                  <div className="px-8 py-8 text-center">
                    <p className="text-sm text-muted-foreground font-body">Initiating vehicle check...</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default HeroSection;
