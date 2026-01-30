import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, LayoutGrid, List } from 'lucide-react';
import { ProductCategory, CATEGORY_LABELS } from '@/types/database';
import { useIsMobile } from '@/hooks/use-mobile';

const categories: (ProductCategory | 'all')[] = ['all', 'drycker', 'fryst', 'snacks', 'deals'];

export function ProductGrid() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [gridView, setGridView] = useState<'single' | 'double'>('double');
  const isMobile = useIsMobile();
  
  const { data: products, isLoading, error } = useProducts(
    selectedCategory === 'all' ? undefined : selectedCategory
  );

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? 'snaxo-gradient text-white' : ''}
          >
            {category === 'all' ? 'Alla produkter' : CATEGORY_LABELS[category]}
          </Button>
        ))}
      </div>

      {/* Search and View Toggle */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Sök produkter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {isMobile && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setGridView(gridView === 'single' ? 'double' : 'single')}
            className="shrink-0"
          >
            {gridView === 'single' ? <LayoutGrid className="h-4 w-4" /> : <List className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center py-12">
          <p className="text-destructive">Kunde inte ladda produkter. Försök igen senare.</p>
        </div>
      )}

      {/* Products grid */}
      {filteredProducts && filteredProducts.length > 0 && (
        <div className={`grid gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4 ${isMobile && gridView === 'single' ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {filteredProducts && filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-2xl mb-2">🔍</p>
          <p className="text-muted-foreground">Inga produkter hittades.</p>
        </div>
      )}
    </div>
  );
}
