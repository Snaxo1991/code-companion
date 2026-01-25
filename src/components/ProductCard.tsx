import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';

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
  };

  return (
    <Card
      className={cn(
        'glass-card overflow-hidden hover-lift group',
        !product.in_stock && 'opacity-60'
      )}
    >
      <div className={cn('relative', compact ? 'h-24' : 'h-32')}>
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <span className="text-3xl">🍿</span>
          </div>
        )}
        {product.is_popular && (
          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
            Populär
          </Badge>
        )}
        {hasDiscount && (
          <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground">
            -{discountPercent}%
          </Badge>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-sm line-clamp-1">{product.name}</h3>
        {!compact && product.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-primary">{product.price} kr</span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                {product.original_price} kr
              </span>
            )}
          </div>

          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full bg-primary hover:bg-primary/90"
            onClick={handleAdd}
            disabled={!product.in_stock}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
