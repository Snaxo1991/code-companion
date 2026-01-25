import { MapPin, Clock, Phone, Mail } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { BottomNav } from '@/components/BottomNav';

export default function About() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-6 py-4 border-b border-border">
        <Logo size="sm" />
      </div>

      <div className="px-6 py-8 space-y-8">
        <section className="text-center">
          <Logo size="lg" showTagline className="mb-6" />
          <p className="text-muted-foreground max-w-md mx-auto">
            SNAXO levererar dina favoritsnacks direkt till dörren. Snabbt, enkelt och gott! 🛵
          </p>
        </section>

        <section className="glass-card p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Leveransområden
          </h2>
          <ul className="space-y-3">
            <li className="flex justify-between">
              <span>Järfälla</span>
              <span className="text-muted-foreground">29 kr</span>
            </li>
            <li className="flex justify-between">
              <span>Upplands Bro</span>
              <span className="text-muted-foreground">39 kr</span>
            </li>
            <li className="flex justify-between">
              <span>Husby / Akalla / Kista</span>
              <span className="text-muted-foreground">29 kr</span>
            </li>
          </ul>
        </section>

        <section className="glass-card p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Öppettider
          </h2>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex justify-between">
              <span>Måndag - Torsdag</span>
              <span>17:00 - 23:00</span>
            </li>
            <li className="flex justify-between">
              <span>Fredag - Lördag</span>
              <span>15:00 - 02:00</span>
            </li>
            <li className="flex justify-between">
              <span>Söndag</span>
              <span>15:00 - 23:00</span>
            </li>
          </ul>
        </section>

        <section className="glass-card p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">Kontakta oss</h2>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <a href="tel:+46701234567" className="text-muted-foreground hover:text-foreground">
                070-123 45 67
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <a href="mailto:hej@snaxo.se" className="text-muted-foreground hover:text-foreground">
                hej@snaxo.se
              </a>
            </li>
          </ul>
        </section>

        <section className="text-center text-sm text-muted-foreground">
          <p>© 2025 SNAXO. Alla rättigheter förbehållna.</p>
          <p className="mt-2">Made with 🧡 in Stockholm</p>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
