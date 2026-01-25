import { useEffect, useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/database';
import { useCart } from '@/hooks/useCart';

interface UpsellDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
}

export function UpsellDialog({ open, onOpenChange, onContinue }: UpsellDialogProps) {
  const [upsellProducts, setUpsellProducts] = useState<Product[]>([]);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const { addItem, items } = useCart();

  useEffect(() => {
    if (open) {
      fetchUpsellProducts();
      setAddedIds(new Set());
    }
  }, [open]);

  const fetchUpsellProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', 'snacks')
      .eq('in_stock', true)
      .limit(4);

    if (!error && data) {
      setUpsellProducts(data as Product[]);
    }
  };

  const handleAddItem = (product: Product) => {
    addItem(product);
    setAddedIds(prev => new Set(prev).add(product.id));
  };

  const isInCart = (productId: string) => {
    return items.some(item => item.product.id === productId) || addedIds.has(productId);
  };

  const handleContinue = () => {
    onOpenChange(false);
    onContinue();
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-center">
            Du har inte glömt lägga till dessa? 🍫
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 py-4">
          <div className="grid grid-cols-2 gap-3">
            {upsellProducts.map((product) => {
              const inCart = isInCart(product.id);
              
              return (
                <div
                  key={product.id}
                  className="bg-card border border-border rounded-lg p-3 flex flex-col items-center text-center"
                >
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-16 h-16 object-contain mb-2"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mb-2">
                      <span className="text-2xl">{getCategoryEmoji(product.category)}</span>
                    </div>
                  )}
                  <p className="text-sm font-medium line-clamp-2 mb-1">{product.name}</p>
                  <p className="text-sm text-primary font-bold mb-2">{Math.round(product.price)} kr</p>
                  <Button
                    size="sm"
                    variant={inCart ? "secondary" : "default"}
                    className={inCart ? "" : "snaxo-gradient text-white"}
                    onClick={() => handleAddItem(product)}
                    disabled={inCart}
                  >
                    {inCart ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Tillagd
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-1" />
                        Lägg till
                      </>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            onClick={handleContinue}
            className="w-full snaxo-gradient text-white"
            size="lg"
          >
            Fortsätt till kassan
          </Button>
          <Button
            variant="ghost"
            onClick={handleContinue}
            className="w-full text-muted-foreground"
          >
            Nej tack, fortsätt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
