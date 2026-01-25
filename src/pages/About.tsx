import { Layout } from '@/components/Layout';
import { Heart, Truck, Tag } from 'lucide-react';

export default function About() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="snaxo-gradient py-12 md:py-16">
        <div className="container px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Om SNAXO
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Vi fixar drycken och du fixar stämningen! 🛵
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-20">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            
            {/* Upplevelse */}
            <div className="bg-card rounded-2xl p-8 border border-border shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6 mx-auto">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-bold text-center mb-4 text-primary">
                UPPLEVELSE
              </h2>
              <p className="text-center text-foreground/80 mb-4">
                Hos SNAXO sätter vi alltid våra kunder i centrum. Snabbt, smidigt och bekvämt.
              </p>
              <p className="text-center text-foreground/80 mb-6">
                Vi erbjuder bekvämlighet, snabb service och ett brett sortiment.
              </p>
              <p className="text-center font-display text-lg italic text-primary">
                Vi fixar drycken och du fixar stämningen
              </p>
            </div>

            {/* SNAXO */}
            <div className="bg-card rounded-2xl p-8 border border-border shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-secondary/20 mb-6 mx-auto">
                <Truck className="h-8 w-8 text-secondary-foreground" />
              </div>
              <h2 className="font-display text-2xl font-bold text-center mb-4 text-secondary-foreground">
                SNAXO
              </h2>
              <p className="text-center text-foreground/80 mb-4">
                Vi levererar snacks och dryck direkt till dörren, utan att gå till butiken.
              </p>
              <p className="text-center font-display text-lg italic text-secondary-foreground mt-8">
                Beställ på några klick, luta dig tillbaka och njut. Vi tar hand om resten.
              </p>
            </div>

            {/* Pris */}
            <div className="bg-card rounded-2xl p-8 border border-border shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-accent/50 mb-6 mx-auto">
                <Tag className="h-8 w-8 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-bold text-center mb-4 text-primary">
                PRIS
              </h2>
              <p className="text-center text-foreground/80 mb-4">
                Hos SNAXO får du alltid schyssta priser på snacks och dryck.
              </p>
              <p className="text-center font-display text-lg italic text-primary mt-8">
                Vi lägger regelbundet ut veckans erbjudande så att du kan njuta av dina favoriter till ännu bättre pris!
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Delivery Areas */}
      <section className="py-12 bg-accent/30">
        <div className="container px-4">
          <h2 className="font-display text-3xl font-bold text-center mb-8">Leveransområden</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-card rounded-xl p-6 text-center border border-border">
              <h3 className="font-display font-bold text-lg mb-2">Järfälla</h3>
              <p className="text-2xl font-bold text-primary">29 kr</p>
            </div>
            <div className="bg-card rounded-xl p-6 text-center border border-border">
              <h3 className="font-display font-bold text-lg mb-2">Upplands Bro</h3>
              <p className="text-2xl font-bold text-primary">49 kr</p>
            </div>
            <div className="bg-card rounded-xl p-6 text-center border border-border">
              <h3 className="font-display font-bold text-lg mb-2">Husby, Akalla & Kista</h3>
              <p className="text-2xl font-bold text-primary">52 kr</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
