import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { AreaSelector } from '@/components/AreaSelector';
import { ProductCard } from '@/components/ProductCard';
import { BottomNav } from '@/components/BottomNav';
import { useDeliveryArea } from '@/hooks/useDeliveryArea';
import { supabase } from '@/integrations/supabase/client';

interface DeliveryArea {
  id: string;
  name: string;
  fee: number;
}

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

export default function Index() {
  const navigate = useNavigate();
  const { selectedArea } = useDeliveryArea();
  const [areas, setAreas] = useState<DeliveryArea[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [areasRes, productsRes] = await Promise.all([
        supabase.from('delivery_areas').select('*'),
        supabase.from('products').select('*').eq('is_popular', true).limit(4),
      ]);

      if (areasRes.data) setAreas(areasRes.data);
      if (productsRes.data) setPopularProducts(productsRes.data);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="relative px-6 pt-12 pb-8">
          <Logo size="xl" showTagline className="mb-8" />

          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Välj leveransområde</h2>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : (
              <AreaSelector areas={areas} />
            )}
          </div>
        </div>
      </div>

      {/* Popular Products */}
      <section className="px-6 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">🔥 Populärt just nu</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary"
            onClick={() => navigate('/menu')}
          >
            Visa alla
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {popularProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  description: product.description ?? undefined,
                  original_price: product.original_price ?? undefined,
                  image_url: product.image_url ?? undefined,
                  is_popular: product.is_popular ?? false,
                  in_stock: product.in_stock ?? true,
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="px-6 pb-8">
        <Button
          size="lg"
          className="w-full h-14 text-lg font-bold"
          onClick={() => navigate('/menu')}
          disabled={!selectedArea}
        >
          {selectedArea ? 'Se hela menyn' : 'Välj område först'}
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
        {!selectedArea && (
          <p className="text-center text-sm text-muted-foreground mt-2">
            Välj ett leveransområde ovan för att fortsätta
          </p>
        )}
      </section>

      <BottomNav />
    </div>
  );
}
