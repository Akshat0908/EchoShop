const Footer = () => (
  <footer className="w-full bg-background border-t border-border/40 py-8 mt-16">
    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2 font-bold text-xl text-primary">
        <span className="bg-gradient-to-r from-blue-500 via-blue-400 to-yellow-400 bg-clip-text text-transparent">EchoShop</span>
      </div>
      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <a href="#features" className="hover:text-primary transition-colors">Features</a>
        <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
        <a href="#docs" className="hover:text-primary transition-colors">Docs</a>
        <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
      </div>
      <div className="flex items-center gap-4">
        {/* Social icons placeholder */}
        <span className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">F</span>
        <span className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">T</span>
        <span className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">L</span>
      </div>
    </div>
    <div className="text-center text-xs text-muted-foreground mt-4">
      © {new Date().getFullYear()} EchoShop. All rights reserved.
    </div>
  </footer>
);

export default Footer; 