import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Home, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';

export default function Confirmation() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order');

  return (
    <Layout>
      <div className="container px-4 py-16 text-center">
        <div className="max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          
          <h1 className="font-display text-3xl font-bold mb-4 text-foreground">
            Tack för din beställning! 🎉
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            Vi har tagit emot din beställning och kommer kontakta dig snart för att bekräfta leverans.
          </p>

          {orderId && (
            <div className="bg-card rounded-xl p-6 border border-border text-left mb-8">
              <h2 className="font-display font-bold mb-4">Orderdetaljer</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ordernummer:</span>
                  <span className="font-mono">{orderId.slice(0, 8).toUpperCase()}</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-accent/50 rounded-xl p-6 mb-8">
            <h3 className="font-display font-bold mb-2">Vad händer nu?</h3>
            <ol className="text-sm text-muted-foreground text-left list-decimal list-inside space-y-1">
              <li>Vi levererar din beställning till din dörr!</li>
              <li>Vi kontaktar dig när vi är framme!</li>
            </ol>
          </div>

          <div className="bg-muted/50 rounded-xl p-4 mb-8 text-left">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Tips:</strong> En orderbekräftelse har skickats till din e-post. Hittar du den inte? Kolla i skräpposten!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button variant="outline" className="w-full sm:w-auto">
                <Home className="mr-2 h-4 w-4" />
                Till startsidan
              </Button>
            </Link>
            <Link to="/menu">
              <Button className="snaxo-gradient text-white w-full sm:w-auto">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Fortsätt handla
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
