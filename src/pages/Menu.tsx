import { useEffect, useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/Logo';
import { ProductCard } from '@/components/ProductCard';
import { CategoryTabs } from '@/components/CategoryTabs';
import { BottomNav } from '@/components/BottomNav';
import { useDeliveryArea } from '@/hooks/useDeliveryArea';
import { supabase } from '@/integrations/supabase/client';

type Category = 'all' | 'drycker' | 'fryst' | 'snacks' | 'deals';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  category: string;
  image_url: string | null;
  is_popular: boolean | null;
  in_stock: boolean | null;
}

export default function Menu() {
  const { selectedArea } = useDeliveryArea();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase.from('products').select('*');
      if (data) setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <Logo size="sm" />
            {selectedArea && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{selectedArea.name}</span>
              </div>
            )}
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Sök produkter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary border-none"
            />
          </div>

          {/* Categories */}
          <CategoryTabs
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
      </div>

      {/* Products */}
      <section className="px-6 py-6">
        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Inga produkter hittades {searchQuery && `för "${searchQuery}"`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
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
