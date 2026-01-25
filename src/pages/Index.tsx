import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';
import { ProductGrid } from '@/components/ProductGrid';

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden snaxo-gradient py-16 md:py-24">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4">
                TUGGA NU,<br />TÄNK SEN 🛵
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-lg">
                Hemleverans av dina favoritsnacks, drickor och fryst mat – direkt till din dörr!
              </p>
              <Link to="/menu">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Se menyn <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="flex-1 flex justify-center">
              <img 
                alt="SNAXO" 
                className="w-64 md:w-80 animate-bounce-subtle" 
                src="https://image2url.com/r2/default/images/1769085554564-fedc8c31-abac-4f1e-8375-6fa8c3969d5b.png" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-accent/50">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-card">
              <div className="p-3 rounded-full bg-primary/10">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold">Snabb leverans</h3>
                <p className="text-sm text-muted-foreground">Vid din dörr</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-card">
              <div className="p-3 rounded-full bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold">Enkelt & smidigt</h3>
                <p className="text-sm text-muted-foreground">Beställ på några klick</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-card">
              <div className="p-3 rounded-full bg-primary/10">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold">Stort område</h3>
                <p className="text-sm text-muted-foreground">Järfälla, Upplands Bro, Husby, Akalla & Kista</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-12 md:py-16">
        <div className="container px-4">
          <h2 className="font-display text-3xl font-bold text-center mb-8">Våra produkter</h2>
          <ProductGrid />
        </div>
      </section>
    </Layout>
  );
}
