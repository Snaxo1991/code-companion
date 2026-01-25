import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem as CartItemType } from '@/types/database';
import { useCart } from '@/hooks/useCart';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity } = item;

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
    <div className="flex gap-4 py-4 border-b border-border animate-fade-in">
      {/* Product image */}
      <div className="w-20 h-20 rounded-lg bg-gradient-to-b from-amber-50 to-orange-50 overflow-hidden flex-shrink-0 flex items-center justify-center p-2">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl">
            {getCategoryEmoji(product.category)}
          </div>
        )}
      </div>

      {/* Product details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-display font-semibold truncate">{product.name}</h3>
        <p className="text-sm text-muted-foreground">{product.price.toFixed(0)} kr/st</p>
        
        {/* Quantity controls */}
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => updateQuantity(product.id, quantity - 1)}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-6 text-center font-semibold text-sm">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => updateQuantity(product.id, quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Price and remove */}
      <div className="flex flex-col items-end justify-between">
        <span className="font-display font-bold text-primary">
          {(product.price * quantity).toFixed(0)} kr
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={() => removeItem(product.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
