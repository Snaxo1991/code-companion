import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { Product } from '@/types/database';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

// IDs for the fryst Billy's products
const BILLYS_PEPPERONI_ID = '8776a5ba-bfca-4079-a9ed-f3f17e65ea31';
const BILLYS_CHILI_CHEESE_ID = '30b2baf1-9676-4110-a58f-afd8c8681a24';

interface BillysVariantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BillysVariantDialog({ open, onOpenChange }: BillysVariantDialogProps) {
  const { addItem } = useCart();
  const [variants, setVariants] = useState<Product[]>([]);

  useEffect(() => {
    if (open && variants.length === 0) {
      supabase
        .from('products')
        .select('*')
        .in('id', [BILLYS_PEPPERONI_ID, BILLYS_CHILI_CHEESE_ID])
        .then(({ data }) => {
          if (data) setVariants(data as Product[]);
        });
    }
  }, [open]);

  const handleSelect = (product: Product) => {
    addItem(product);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">Välj sort</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground -mt-2">3 för 2 – valfri sort, gäller t.o.m. 2026-03-20</p>
        <div className="grid grid-cols-2 gap-4 pt-2">
          {variants.map(product => (
            <button
              key={product.id}
              onClick={() => handleSelect(product)}
              className="flex flex-col items-center gap-3 p-4 rounded-xl border border-border hover:border-primary hover:bg-amber-50 transition-all duration-200 group"
            >
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-24 h-24 object-contain group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <span className="text-5xl">🍕</span>
              )}
              <span className="text-sm font-semibold text-center leading-tight">
                {product.name.replace("Billy's (", '').replace(')', '')}
              </span>
              <span className="text-sm font-bold text-primary">{product.price} kr</span>
            </button>
          ))}
        </div>
        <Button variant="outline" className="mt-2" onClick={() => onOpenChange(false)}>
          Avbryt
        </Button>
      </DialogContent>
    </Dialog>
  );
}
