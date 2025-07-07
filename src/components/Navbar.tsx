import { Button } from '@/components/ui/button';

const Navbar = () => (
  <nav className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur border-b border-border/40 shadow-sm">
    <div className="container mx-auto px-4 flex items-center justify-between h-16">
      {/* Logo */}
      <div className="flex items-center gap-2 font-bold text-2xl text-primary">
        <span className="bg-gradient-to-r from-blue-500 via-blue-400 to-yellow-400 bg-clip-text text-transparent">EchoShop</span>
      </div>
      {/* Links */}
      <div className="hidden md:flex items-center gap-8 text-base font-medium text-muted-foreground">
        <a href="#features" className="hover:text-primary transition-colors">Features</a>
        <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
        <a href="#docs" className="hover:text-primary transition-colors">Docs</a>
        <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
      </div>
      {/* CTA */}
      <div className="flex items-center gap-2">
        <Button className="px-6 py-2 text-base font-semibold gradient-primary shadow-md hover:scale-105 transition-all duration-200">
          Get Started
        </Button>
      </div>
    </div>
  </nav>
);

export default Navbar; 