import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import stakeholderPolice from "@/assets/stakeholder-police.jpg";
import stakeholderGov from "@/assets/stakeholder-gov.jpg";
import stakeholderCitizen from "@/assets/stakeholder-citizen.jpg";

const stakeholders = [
  { title: "Citizens", subtitle: "Self-service verification", description: "Verify vehicles before purchase, check registration status, and download ownership reports — all from your phone.", image: stakeholderCitizen, alt: "Young professional checking vehicle status on smartphone", span: "lg:col-span-6" },
  { title: "Law Enforcement", subtitle: "Field operations", description: "Rapid field checks, stolen vehicle alerts, case escalation, and roadside verification in seconds.", image: stakeholderPolice, alt: "Police officer verifying vehicle at checkpoint", span: "lg:col-span-6" },
  { title: "Government & Oversight", subtitle: "National governance", description: "Agency sync dashboards, audit trails, compliance monitoring, and cross-institutional data governance.", image: stakeholderGov, alt: "Government operations center with data dashboards", span: "lg:col-span-12" },
];

const StakeholdersSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const parallax1 = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const parallax2 = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section ref={sectionRef} className="py-28 lg:py-36 bg-card relative overflow-hidden" id="stakeholders">
      {/* Decorative accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-accent/40 to-transparent" />

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-8 mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6"
          >
            <span className="inline-block text-sm font-body font-semibold text-accent uppercase tracking-widest mb-4">Who We Serve</span>
            <h2 className="text-4xl lg:text-6xl font-display font-bold text-foreground leading-[1.05]">
              One platform,<br /><span className="text-primary">every stakeholder</span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-4 lg:col-start-9 flex items-end"
          >
            <p className="text-lg font-body text-muted-foreground leading-relaxed">
              Role-based access ensures every user — from citizens to cabinet-level analysts — gets exactly the tools and data they need.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {stakeholders.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className={`${item.span} group cursor-pointer`}
            >
              <div className="relative h-[460px] rounded-2xl overflow-hidden">
                <motion.img
                  style={{ y: i === 0 ? parallax1 : parallax2 }}
                  src={item.image}
                  alt={item.alt}
                  className="w-full h-[130%] object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  width={800}
                  height={1000}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10">
                  <span className="inline-block text-xs font-body font-semibold text-accent uppercase tracking-widest mb-3">{item.subtitle}</span>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-3xl lg:text-4xl font-display font-bold text-white mb-3">{item.title}</h3>
                      <p className="text-white/70 font-body text-base max-w-md leading-relaxed">{item.description}</p>
                    </div>
                    <div className="flex-shrink-0 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center transition-all group-hover:bg-accent group-hover:border-accent">
                      <ArrowUpRight className="h-5 w-5 text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 grid sm:grid-cols-2 gap-6"
        >
          {[
            { sub: "Claims & risk", title: "Insurance Partners", desc: "Claims verification, fraud detection, risk assessment, and batch processing for insurers across Zimbabwe." },
            { sub: "API & Integration", title: "Commercial Partners", desc: "API access, bulk uploads, fleet verification, token management, and usage analytics for dealers and finance houses." },
          ].map((card) => (
            <div key={card.title} className="p-8 rounded-2xl border border-border bg-background hover:border-primary/30 hover:-translate-y-1 transition-all duration-500 hover:shadow-lg">
              <span className="inline-block text-xs font-body font-semibold text-accent uppercase tracking-widest mb-3">{card.sub}</span>
              <h3 className="text-2xl font-display font-bold text-foreground mb-2">{card.title}</h3>
              <p className="text-muted-foreground font-body leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StakeholdersSection;
