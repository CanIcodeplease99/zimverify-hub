import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-7 w-7 text-primary" />
          <span className="font-display font-bold text-2xl text-foreground">ZimVerify</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 font-body text-sm">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#stakeholders" className="text-muted-foreground hover:text-foreground transition-colors">Stakeholders</a>
        </nav>

        <Button onClick={() => navigate("/app/login")} className="font-body">
          Sign In
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
