import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Shield, Users, Search, FileText, Lock, BarChart3, ArrowRight } from "lucide-react";
import featuresTablet from "@/assets/features-tablet.jpg";

const features = [
  { icon: Search, title: "Instant Verification", description: "Check any vehicle by plate or VIN in seconds with comprehensive data from national registries.", accent: false },
  { icon: Shield, title: "Stolen Vehicle Alerts", description: "Real-time cross-referencing with Zimbabwe Republic Police databases for stolen markers.", accent: true },
  { icon: FileText, title: "CARFAX-Style Reports", description: "Full vehicle history including ownership, accidents, title brands, and service records.", accent: false },
  { icon: Users, title: "Multi-Role Access", description: "Tailored dashboards for citizens, police, government analysts, insurers, and partners.", accent: false },
  { icon: Lock, title: "MFA & Audit Logging", description: "Enterprise-grade security with multi-factor authentication and complete audit trails.", accent: true },
  { icon: BarChart3, title: "Analytics & Oversight", description: "Government-grade dashboards for agency health, sync status, and compliance monitoring.", accent: false },
];

const FeaturesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section ref={sectionRef} className="py-28 lg:py-36 relative" id="features">
      <div className="container mx-auto px-6">
        {/* Section intro */}
        <div className="grid lg:grid-cols-12 gap-12 mb-20 lg:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5"
          >
            <span className="inline-block text-sm font-body font-semibold text-accent uppercase tracking-widest mb-4">
              Platform Capabilities
            </span>
            <h2 className="text-4xl lg:text-6xl font-display font-bold text-foreground leading-[1.05]">
              Built for<br />
              <span className="text-primary">national scale</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="lg:col-span-5 lg:col-start-8 flex items-end"
          >
            <p className="text-lg lg:text-xl font-body text-muted-foreground leading-relaxed">
              A comprehensive verification ecosystem connecting citizens, law enforcement, 
              and government institutions across Zimbabwe — with the security and reliability 
              of enterprise infrastructure.
            </p>
          </motion.div>
        </div>

        {/* Feature image + first 2 features */}
        <div className="grid lg:grid-cols-12 gap-6 mb-6">
          <motion.div
            style={{ y: imageY }}
            className="lg:col-span-5 lg:row-span-2"
          >
            <div className="relative h-full min-h-[400px] rounded-2xl overflow-hidden group">
              <img
                src={featuresTablet}
                alt="Vehicle verification dashboard on tablet"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                width={1200}
                height={800}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-white/90 font-display text-2xl font-bold">Verification at your fingertips</p>
                <p className="text-white/60 font-body text-sm mt-2">Accessible from any device, anywhere in Zimbabwe</p>
              </div>
            </div>
          </motion.div>

          {features.slice(0, 2).map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className={`${i === 0 ? "lg:col-span-4" : "lg:col-span-3"} group`}
            >
              <div className={`h-full p-8 rounded-2xl border transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${
                feature.accent
                  ? "bg-primary text-primary-foreground border-primary hover:shadow-primary/20"
                  : "bg-card/80 backdrop-blur-sm border-border/60 hover:border-primary/30 hover:bg-card"
              }`}>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                  feature.accent ? "bg-white/15" : "bg-primary/8"
                }`}>
                  <feature.icon className={`h-7 w-7 ${feature.accent ? "text-white" : "text-primary"}`} />
                </div>
                <h3 className={`text-xl font-display font-bold mb-3 ${feature.accent ? "" : "text-foreground"}`}>{feature.title}</h3>
                <p className={`font-body leading-relaxed text-[15px] ${feature.accent ? "text-white/80" : "text-muted-foreground"}`}>{feature.description}</p>
                <ArrowRight className={`h-5 w-5 mt-6 transition-transform group-hover:translate-x-2 ${feature.accent ? "text-white/60" : "text-primary/40"}`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Remaining 4 features */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.slice(2).map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group"
            >
              <div className={`h-full p-8 rounded-2xl border transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${
                feature.accent
                  ? "bg-primary text-primary-foreground border-primary hover:shadow-primary/20"
                  : "bg-card/80 backdrop-blur-sm border-border/60 hover:border-primary/30 hover:bg-card"
              }`}>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                  feature.accent ? "bg-white/15" : "bg-primary/8"
                }`}>
                  <feature.icon className={`h-7 w-7 ${feature.accent ? "text-white" : "text-primary"}`} />
                </div>
                <h3 className={`text-xl font-display font-bold mb-3 ${feature.accent ? "" : "text-foreground"}`}>{feature.title}</h3>
                <p className={`font-body leading-relaxed text-[15px] ${feature.accent ? "text-white/80" : "text-muted-foreground"}`}>{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
