import { useState, useEffect } from "react";
import { Shield, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border/50 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Shield className={`h-7 w-7 transition-colors duration-300 ${scrolled ? "text-primary" : "text-accent"}`} />
          <span className={`font-display font-bold text-2xl transition-colors duration-300 ${
            scrolled ? "text-foreground" : "text-white"
          }`}>
            ZimVerify
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-10 font-body text-sm">
          {["Features", "Stakeholders"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className={`transition-colors duration-300 hover:text-accent ${
                scrolled ? "text-muted-foreground" : "text-white/70 hover:text-white"
              }`}
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate("/app/login")}
            className={`font-body rounded-xl px-6 transition-all duration-300 ${
              scrolled
                ? ""
                : "bg-white/10 border border-white/20 hover:bg-white/20 text-white"
            }`}
            variant={scrolled ? "default" : "ghost"}
          >
            Sign In
          </Button>

          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className={`h-6 w-6 ${scrolled ? "text-foreground" : "text-white"}`} />
            ) : (
              <Menu className={`h-6 w-6 ${scrolled ? "text-foreground" : "text-white"}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border">
          <nav className="container mx-auto px-6 py-6 flex flex-col gap-4 font-body">
            <a href="#features" className="text-foreground py-2" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#stakeholders" className="text-foreground py-2" onClick={() => setMenuOpen(false)}>Stakeholders</a>
            <Button onClick={() => navigate("/app/login")} className="mt-2 rounded-xl">Sign In</Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
