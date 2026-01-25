import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';

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

interface UpsellDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: Product[];
  onContinue: () => void;
}

export function UpsellDialog({ open, onOpenChange, products, onContinue }: UpsellDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card">
        <DialogHeader>
          <DialogTitle className="gradient-text">Glöm inte snacksen! 🍿</DialogTitle>
          <DialogDescription>
            Lägg till något extra gott till din beställning
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 my-4">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} compact />
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              onOpenChange(false);
              onContinue();
            }}
          >
            Nej tack
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              onOpenChange(false);
              onContinue();
            }}
          >
            Fortsätt till kassan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
