import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="container relative z-10 mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-primary-foreground mb-6">
            Secure. Trusted. National.
          </h2>
          <p className="text-xl text-primary-foreground/80 font-body max-w-2xl mx-auto mb-10">
            Join the network of institutions and citizens building transparency in Zimbabwe's vehicle ecosystem.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-10 py-6 font-body"
            onClick={() => navigate("/app/login")}
          >
            Access the Platform
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
