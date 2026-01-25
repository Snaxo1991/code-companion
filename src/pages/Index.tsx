import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { ProductCard } from '@/components/ProductCard';
import { BottomNav } from '@/components/BottomNav';
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

export default function Index() {
  const navigate = useNavigate();
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_popular', true)
        .limit(4);

      if (data) setPopularProducts(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 via-background to-background pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-200/80 via-orange-100/50 to-background" />
        <div className="relative px-6 pt-10 pb-10 flex flex-col items-center">
          <Logo size="hero" showTagline className="mb-8" />
          
          <Button
            size="lg"
            className="w-full max-w-sm h-14 text-lg font-bold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg"
            onClick={() => navigate('/menu')}
          >
            Beställ nu! 🛵
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
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

      <BottomNav />
    </div>
  );
}
