import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-16 lg:py-20 border-t border-border bg-card">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2.5 mb-5">
              <Shield className="h-7 w-7 text-primary" />
              <span className="font-display font-bold text-2xl text-foreground">ZimVerify</span>
            </div>
            <p className="text-muted-foreground font-body leading-relaxed max-w-xs">
              Zimbabwe's National Vehicle Information & Verification Platform. 
              Trusted by government, law enforcement, and citizens.
            </p>
          </div>

          {/* Links */}
          <div className="lg:col-span-2 lg:col-start-7">
            <h4 className="font-display font-semibold text-foreground mb-4">Platform</h4>
            <ul className="space-y-3 font-body text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#stakeholders" className="hover:text-primary transition-colors">Stakeholders</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API Docs</a></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-display font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-3 font-body text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Data Protection</a></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-display font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-3 font-body text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Help Centre</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Status</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground font-body">
            © {new Date().getFullYear()} ZimVerify. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/60 font-body">
            A product of Tappy-K Consultants
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
