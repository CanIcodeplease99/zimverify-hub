import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 border-t bg-card">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-display font-bold text-xl text-foreground">ZimVerify</span>
          </div>
          <p className="text-sm text-muted-foreground font-body">
            © {new Date().getFullYear()} ZimVerify — National Vehicle Information & Verification Platform. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm font-body text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
