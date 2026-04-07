import { motion } from "framer-motion";
import { User, ShieldCheck, Building2, Landmark, Handshake } from "lucide-react";

const roles = [
  {
    icon: User,
    title: "Citizens",
    description: "Verify vehicles before purchase, check registration status, and access ownership history.",
  },
  {
    icon: ShieldCheck,
    title: "Law Enforcement",
    description: "Rapid field checks, stolen vehicle alerts, case management, and roadside verification.",
  },
  {
    icon: Landmark,
    title: "Government",
    description: "Oversight dashboards, agency sync monitoring, audit trails, and system governance.",
  },
  {
    icon: Building2,
    title: "Insurance",
    description: "Claims verification, fraud detection, risk assessment, and batch processing.",
  },
  {
    icon: Handshake,
    title: "Commercial Partners",
    description: "API access, bulk uploads, fleet verification, and usage analytics.",
  },
];

const StakeholdersSection = () => {
  return (
    <section className="py-24" id="stakeholders">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-display font-bold text-foreground mb-4">
            Who Uses ZimVerify
          </h2>
          <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
            Role-based access ensures every stakeholder gets the tools they need.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {roles.map((role, i) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-center p-6 rounded-xl border bg-card hover:shadow-md transition-all"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <role.icon className="h-7 w-7 text-accent" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">{role.title}</h3>
              <p className="text-sm text-muted-foreground font-body">{role.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StakeholdersSection;
