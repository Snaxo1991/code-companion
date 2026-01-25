import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img 
            alt="SNAXO" 
            className="h-12 w-auto" 
            src="https://image2url.com/r2/default/images/1769085143524-6a729c61-5fce-4614-ae63-51666baeb0f3.png" 
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            Hem
          </Link>
          <Link to="/menu" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            Meny
          </Link>
          <Link to="/om-oss" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            Om oss
          </Link>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <Link to="/varukorg" className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs font-bold text-primary-foreground flex items-center justify-center animate-scale-in">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>

          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border animate-fade-in">
          <nav className="container flex flex-col gap-2 p-4">
            <Link to="/" className="py-2 text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
              Hem
            </Link>
            <Link to="/menu" className="py-2 text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
              Meny
            </Link>
            <Link to="/om-oss" className="py-2 text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
              Om oss
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
