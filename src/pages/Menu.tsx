import { useEffect, useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/Logo';
import { ProductCard } from '@/components/ProductCard';
import { CategoryTabs } from '@/components/CategoryTabs';
import { BottomNav } from '@/components/BottomNav';
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
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-background to-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-b from-orange-100/95 to-background/95 backdrop-blur-lg border-b border-border/50">
        <div className="px-5 py-4">
          {/* Friendly header */}
          <div className="flex items-center justify-between mb-4">
            <Logo size="sm" />
            <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Snabb leverans!</span>
            </div>
          </div>

          {/* Welcome message */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-foreground">Vad suger du på idag? 😋</h1>
            <p className="text-muted-foreground text-sm mt-1">Välj bland våra godsaker!</p>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="🔍 Sök efter snacks, drycker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-card border-2 border-border/50 rounded-2xl text-base focus:border-primary shadow-sm"
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
      <section className="px-5 py-6">
        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-56 bg-card animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🤔</div>
            <h3 className="text-xl font-bold mb-2">Hoppsan!</h3>
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
