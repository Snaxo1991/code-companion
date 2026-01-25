import { Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  image_url?: string;
  is_popular?: boolean;
  in_stock?: boolean;
}

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.original_price! - product.price) / product.original_price!) * 100)
    : 0;

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <Card
      className={cn(
        'overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card border-border/50 rounded-2xl',
        !product.in_stock && 'opacity-60'
      )}
    >
      <div className={cn('relative', compact ? 'h-24' : 'h-36')}>
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
            <span className="text-4xl">🍿</span>
          </div>
        )}
        {product.is_popular && (
          <Badge className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-md">
            ⭐ Populär
          </Badge>
        )}
        {hasDiscount && (
          <Badge className="absolute top-2 right-2 bg-red-500 text-white border-0 shadow-md">
            -{discountPercent}%
          </Badge>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-base line-clamp-2 leading-tight mb-1">{product.name}</h3>
        {!compact && product.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col">
            <span className="font-bold text-lg text-primary">{product.price} kr</span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                {product.original_price} kr
              </span>
            )}
          </div>

          <Button
            size="icon"
            className={cn(
              'h-10 w-10 rounded-full shadow-md transition-all duration-300',
              justAdded 
                ? 'bg-green-500 hover:bg-green-500' 
                : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
            )}
            onClick={handleAdd}
            disabled={!product.in_stock}
          >
            {justAdded ? (
              <Check className="h-5 w-5 text-white" />
            ) : (
              <Plus className="h-5 w-5 text-white" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
