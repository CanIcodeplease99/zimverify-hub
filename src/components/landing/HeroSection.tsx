import { motion } from "framer-motion";
import { Shield, ChevronRight, Search, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroCity from "@/assets/hero-city.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

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
          {/* Left content — spans 7 columns */}
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
                variant="outline"
                size="lg"
                className="text-lg px-10 py-7 font-body border-white/25 text-white hover:bg-white/10 hover:text-white rounded-xl backdrop-blur-sm"
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

          {/* Right — floating verification card */}
          <motion.div
            initial={{ opacity: 0, y: 60, rotateY: -5 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 hidden lg:block"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-accent/20 rounded-3xl blur-2xl" />
              
              <div className="relative bg-card/95 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl overflow-hidden">
                {/* Card header */}
                <div className="px-8 py-5 border-b border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="font-display font-semibold text-foreground">Vehicle Report</span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-success" />
                    <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                    <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
                  </div>
                </div>

                {/* Search bar */}
                <div className="px-8 pt-6">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-background border border-border">
                    <Search className="h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground font-body">ABC 1234 ZW</span>
                  </div>
                </div>

                {/* Result */}
                <div className="px-8 py-5">
                  <div className="bg-success/10 border border-success/20 rounded-xl p-5 mb-5">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                      <span className="font-semibold text-success font-body">CLEAR — No issues found</span>
                    </div>
                    <p className="text-sm text-muted-foreground font-body">2024 Toyota Hilux • Single owner • Harare</p>
                  </div>

                  {/* Mini verification items */}
                  <div className="space-y-3">
                    {[
                      { label: "Registration Status", status: "Valid" },
                      { label: "Ownership History", status: "1 owner" },
                      { label: "Stolen Check", status: "Clear" },
                      { label: "Insurance Status", status: "Active" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                        <span className="text-sm font-body text-muted-foreground">{item.label}</span>
                        <span className="text-sm font-body font-semibold text-success flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
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
