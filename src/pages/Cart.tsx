import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { CartItem } from '@/components/CartItem';
import { UpsellDialog } from '@/components/UpsellDialog';
import { BottomNav } from '@/components/BottomNav';
import { useCart } from '@/hooks/useCart';
import { useDeliveryArea } from '@/hooks/useDeliveryArea';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  image_url: string | null;
  is_popular: boolean | null;
  in_stock: boolean | null;
}

export default function Cart() {
  const navigate = useNavigate();
  const { items, subtotal } = useCart();
  const { selectedArea } = useDeliveryArea();
  const [showUpsell, setShowUpsell] = useState(false);
  const [upsellProducts, setUpsellProducts] = useState<Product[]>([]);

  const deliveryFee = selectedArea?.fee ?? 29;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    async function fetchUpsellProducts() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('category', 'snacks')
        .eq('in_stock', true)
        .limit(4);
      if (data) setUpsellProducts(data);
    }
    fetchUpsellProducts();
  }, []);

  const handleCheckout = () => {
    if (upsellProducts.length > 0 && items.length > 0) {
      setShowUpsell(true);
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="px-6 py-4 border-b border-border">
          <Logo size="sm" />
        </div>

        <div className="flex flex-col items-center justify-center px-6 py-24">
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold mb-2">Varukorgen är tom</h2>
          <p className="text-muted-foreground text-center mb-6">
            Lägg till några godsaker från menyn!
          </p>
          <Button onClick={() => navigate('/menu')}>
            Se menyn
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-40">
      <div className="px-6 py-4 border-b border-border">
        <Logo size="sm" />
      </div>

      <section className="px-6 py-6">
        <h1 className="text-2xl font-bold mb-6">Din varukorg</h1>

        <div className="space-y-3">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Summary */}
      <div className="fixed bottom-16 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border p-6 safe-area-inset-bottom">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Delsumma</span>
            <span>{subtotal} kr</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Leverans ({selectedArea?.name ?? 'Välj område'})
            </span>
            <span>{deliveryFee} kr</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
            <span>Totalt</span>
            <span className="text-primary">{total} kr</span>
          </div>
        </div>

        <Button
          size="lg"
          className="w-full h-12 font-bold"
          onClick={handleCheckout}
          disabled={!selectedArea}
        >
          {selectedArea ? 'Fortsätt till kassan' : 'Välj leveransområde först'}
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </div>

      <UpsellDialog
        open={showUpsell}
        onOpenChange={setShowUpsell}
        products={upsellProducts.map((p) => ({
          ...p,
          description: p.description ?? undefined,
          original_price: p.original_price ?? undefined,
          image_url: p.image_url ?? undefined,
          is_popular: p.is_popular ?? false,
          in_stock: p.in_stock ?? true,
        }))}
        onContinue={() => navigate('/checkout')}
      />

      <BottomNav />
    </div>
  );
}
