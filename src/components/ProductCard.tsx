import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Product, CATEGORY_LABELS } from '@/types/database';
import { useCart } from '@/hooks/useCart';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find(item => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'drycker':
        return 'bg-blue-100 text-blue-800';
      case 'fryst':
        return 'bg-cyan-100 text-cyan-800';
      case 'snacks':
        return 'bg-orange-100 text-orange-800';
      case 'deals':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'drycker':
        return '🥤';
      case 'fryst':
        return '🧊';
      case 'snacks':
        return '🍿';
      case 'deals':
        return '🎉';
      default:
        return '📦';
    }
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card border-border">
      <div className="aspect-square relative overflow-hidden p-6 flex items-center justify-center bg-gradient-to-b from-amber-50 to-orange-50">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="max-w-[85%] max-h-[85%] object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            {getCategoryEmoji(product.category)}
          </div>
        )}
        <span className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadgeClass(product.category)}`}>
          {CATEGORY_LABELS[product.category]}
        </span>
        {product.is_popular && (
          <span className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
            ✨ Nyhet
          </span>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-display font-semibold text-lg mb-1 line-clamp-1">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 shrink-0">
            <span className="font-display font-bold text-lg text-primary whitespace-nowrap">
              {Math.round(product.price)} kr
            </span>
            {product.original_price != null && product.original_price > product.price && (
              <span className="text-xs text-muted-foreground line-through whitespace-nowrap">
                {Math.round(product.original_price)} kr
              </span>
            )}
          </div>
          
          {quantity === 0 ? (
            <Button 
              onClick={() => addItem(product)}
              size="sm"
              className="snaxo-gradient text-white"
            >
              <Plus className="h-4 w-4 mr-1" />
              Lägg till
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateQuantity(product.id, quantity - 1)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-6 text-center font-semibold">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => addItem(product)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
