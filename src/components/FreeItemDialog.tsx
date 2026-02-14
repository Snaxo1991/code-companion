import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface FreeItemDialogProps {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export function FreeItemDialog({ open, onAccept, onDecline }: FreeItemDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onDecline(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-center">
            🍫 Vill du ha en Delicatoboll på köpet?
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Helt gratis – vi bjuder!
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center py-4">
          <img
            src="/products/delicatoboll.png"
            alt="Delicatoboll"
            className="w-24 h-24 object-contain"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Button
            onClick={onAccept}
            className="w-full snaxo-gradient text-white"
            size="lg"
          >
            Ja tack! 🎉
          </Button>
          <Button
            variant="ghost"
            onClick={onDecline}
            className="w-full text-muted-foreground"
          >
            Nej tack
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
