import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import patternCta from "@/assets/pattern-cta.jpg";

const CTASection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

  return (
    <section ref={sectionRef} className="py-28 lg:py-36 relative overflow-hidden">
      <motion.div style={{ scale: imgScale }} className="absolute inset-0">
        <img src={patternCta} alt="" className="w-full h-full object-cover" loading="lazy" width={1920} height={800} aria-hidden="true" />
        <div className="absolute inset-0 bg-primary/85" />
      </motion.div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/10 mb-8">
              <Shield className="h-4 w-4 text-accent" />
              <span className="text-sm font-body text-white/80">Government-certified platform</span>
            </div>
            <h2 className="text-4xl lg:text-6xl xl:text-7xl font-display font-bold text-white leading-[1.05] mb-6">
              Secure.<br />Trusted.<br /><span className="text-accent">National.</span>
            </h2>
            <p className="text-xl text-white/70 font-body max-w-lg mb-10 leading-relaxed">
              Join the network of institutions and citizens building transparency in Zimbabwe's vehicle ecosystem.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="text-lg px-10 py-7 font-body bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl shadow-lg shadow-accent/25" onClick={() => navigate("/app/login")}>
                Access the Platform <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" className="text-lg px-10 py-7 font-body bg-white/10 border border-white/20 text-white hover:bg-white/20 rounded-xl">
                Request a Demo
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="lg:col-span-4 lg:col-start-9 hidden lg:block"
          >
            <div className="space-y-6">
              {[
                { value: "12", label: "Institutions connected", sublabel: "CVR, ZINARA, ZRP, and more" },
                { value: "2.4M+", label: "Vehicle checks", sublabel: "Processed since launch" },
                { value: "<200ms", label: "Response time", sublabel: "Average query latency" },
                { value: "99.9%", label: "Uptime SLA", sublabel: "Enterprise-grade reliability" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-6 border-b border-white/10 pb-5 last:border-0"
                >
                  <span className="text-4xl font-display font-bold text-accent min-w-[100px]">{stat.value}</span>
                  <div>
                    <p className="text-white font-body font-semibold">{stat.label}</p>
                    <p className="text-white/50 font-body text-sm">{stat.sublabel}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
