import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-bold gradient-text">SNAXO</h3>
            <p className="text-sm text-muted-foreground">
              TUGGA NU, TÄNK SEN 🛵
            </p>
            <p className="text-sm text-muted-foreground">
              Hemleverans av snacks, drickor och fryst mat direkt till din dörr.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold">Snabblänkar</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/menu" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Meny
              </Link>
              <Link to="/om-oss" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Om oss
              </Link>
              <Link to="/varukorg" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Varukorg
              </Link>
            </nav>
          </div>

          {/* Delivery Areas */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold">Leveransområden</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Järfälla - 29 kr</li>
              <li>Upplands Bro - 49 kr</li>
              <li>Husby, Akalla & Kista - 52 kr</li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold">Följ oss</h4>
            <div className="flex gap-4">
              <a 
                href="https://instagram.com/snaxo.se" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://tiktok.com/@snaxo.se" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
            </div>
            <p className="text-sm text-muted-foreground">@snaxo.se</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} SNAXO. Alla rättigheter förbehållna.</p>
        </div>
      </div>
    </footer>
  );
}
