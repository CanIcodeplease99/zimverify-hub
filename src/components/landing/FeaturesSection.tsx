import { motion } from "framer-motion";
import { Shield, Users, Search, FileText, Lock, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Instant Verification",
    description: "Check any vehicle by plate or VIN in seconds with comprehensive data from national registries.",
  },
  {
    icon: Shield,
    title: "Stolen Vehicle Alerts",
    description: "Real-time cross-referencing with Zimbabwe Republic Police databases for stolen markers.",
  },
  {
    icon: Users,
    title: "Multi-Role Access",
    description: "Tailored dashboards for citizens, police, government analysts, insurers, and partners.",
  },
  {
    icon: FileText,
    title: "CARFAX-Style Reports",
    description: "Full vehicle history including ownership, accidents, title brands, and service records.",
  },
  {
    icon: Lock,
    title: "MFA & Audit Logging",
    description: "Enterprise-grade security with multi-factor authentication and complete audit trails.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Oversight",
    description: "Government-grade dashboards for agency health, sync status, and compliance monitoring.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-card" id="features">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-display font-bold text-foreground mb-4">
            Built for National Scale
          </h2>
          <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
            A comprehensive platform connecting citizens, law enforcement, and government institutions.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-8 rounded-xl bg-background border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground font-body leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
