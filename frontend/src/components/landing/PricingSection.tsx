import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, FileText, Package, Building2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { checkTypes, bundles, businessTiers, formatUSD } from "@/config/pricing";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const PricingSection = () => {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-28 lg:py-36 bg-muted/30 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <Badge variant="outline" className="mb-4 px-4 py-1.5 border-primary/20 bg-primary/5 text-primary font-body">
            Transparent Pricing
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-foreground leading-tight">
            Simple, pay‑as‑you‑go pricing
          </h2>
          <p className="text-lg text-muted-foreground font-body mt-4 leading-relaxed">
            No subscriptions required for citizens. Business tiers unlock volume discounts and API access.
          </p>
        </motion.div>

        {/* ── Citizen Pricing ─────────────────────── */}
        <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}>
          <motion.h3 variants={itemVariants} className="text-sm font-body font-semibold uppercase tracking-widest text-primary mb-6">
            For Citizens & Individuals
          </motion.h3>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {checkTypes.map((ct) => (
              <motion.div
                key={ct.id}
                variants={itemVariants}
                className={`group relative rounded-2xl border p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  ct.id === "full"
                    ? "border-primary/30 bg-card shadow-lg shadow-primary/5"
                    : "border-border/40 bg-card/70"
                }`}
              >
                {ct.id === "full" && (
                  <Badge className="absolute -top-3 right-6 bg-primary text-primary-foreground font-body text-xs">Most Popular</Badge>
                )}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${ct.id === "full" ? "bg-primary/10" : "bg-muted/40"}`}>
                      {ct.id === "quick" ? <Zap className="h-6 w-6 text-accent" /> : <FileText className="h-6 w-6 text-primary" />}
                    </div>
                    <div>
                      <h4 className="text-xl font-display font-bold text-foreground">{ct.name}</h4>
                      <p className="text-sm text-muted-foreground font-body">{ct.description}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-display font-bold text-foreground">{formatUSD(ct.price)}</span>
                  <span className="text-muted-foreground font-body ml-1">/ check</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {ct.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm font-body text-foreground">
                      <Check className="h-4 w-4 text-success mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => navigate("/app/login")}
                  className={`w-full rounded-xl font-body h-12 ${
                    ct.id === "full"
                      ? "bg-primary hover:bg-primary/90 shadow-sm shadow-primary/15"
                      : "bg-muted hover:bg-muted/80 text-foreground"
                  }`}
                >
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Bundles */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-20">
            <div className="flex items-center gap-2 mr-2">
              <Package className="h-5 w-5 text-accent" />
              <span className="font-body font-semibold text-foreground">Save with bundles:</span>
            </div>
            {bundles.map((b) => (
              <div key={b.id} className="px-5 py-2.5 rounded-xl border border-accent/20 bg-accent/5 font-body text-sm">
                <span className="font-semibold text-foreground">{b.label}</span>
                <span className="text-muted-foreground ml-2">
                  {formatUSD(b.totalPrice)} ({formatUSD(b.unitPrice)}/each)
                </span>
              </div>
            ))}
          </motion.div>

          {/* ── Business Tiers ─────────────────────── */}
          <motion.h3 variants={itemVariants} className="text-sm font-body font-semibold uppercase tracking-widest text-primary mb-6">
            For Businesses & Institutions
          </motion.h3>

          <div className="grid md:grid-cols-3 gap-6">
            {businessTiers.map((tier) => (
              <motion.div
                key={tier.id}
                variants={itemVariants}
                className={`relative rounded-2xl border p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  tier.highlight
                    ? "border-primary/30 bg-card shadow-lg shadow-primary/5"
                    : "border-border/40 bg-card/70"
                }`}
              >
                {tier.highlight && (
                  <Badge className="absolute -top-3 right-6 bg-accent text-accent-foreground font-body text-xs">Recommended</Badge>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <Building2 className="h-5 w-5 text-primary" />
                  <h4 className="text-lg font-display font-bold text-foreground">{tier.name}</h4>
                </div>

                <p className="text-sm text-muted-foreground font-body mb-4">{tier.volumeRange}</p>

                <div className="mb-1">
                  <span className="text-3xl font-display font-bold text-foreground">{formatUSD(tier.perReport)}</span>
                  <span className="text-muted-foreground font-body ml-1">/ report</span>
                </div>
                {tier.platformFee !== null && (
                  <p className="text-sm text-muted-foreground font-body mb-6">
                    + {formatUSD(tier.platformFee)}/mo platform fee
                  </p>
                )}
                {tier.platformFee === null && <p className="text-sm text-muted-foreground font-body mb-6">No platform fee</p>}

                <ul className="space-y-2.5 mb-8">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm font-body text-foreground">
                      <Check className="h-4 w-4 text-success mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={tier.highlight ? "default" : "outline"}
                  onClick={() => navigate("/app/login")}
                  className={`w-full rounded-xl font-body h-11 ${
                    tier.highlight ? "shadow-sm shadow-primary/15" : "border-border/40"
                  }`}
                >
                  {tier.id === "enterprise" ? "Contact Sales" : "Get Started"}
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
