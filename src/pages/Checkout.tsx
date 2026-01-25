import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Logo } from '@/components/Logo';
import { useCart } from '@/hooks/useCart';
import { useDeliveryArea } from '@/hooks/useDeliveryArea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type DeliverySpeed = 'standard' | 'priority';

export default function Checkout() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, subtotal, clearCart } = useCart();
  const { selectedArea } = useDeliveryArea();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  });
  const [deliverySpeed, setDeliverySpeed] = useState<DeliverySpeed>('standard');

  const deliveryFee = selectedArea?.fee ?? 29;
  const priorityFee = deliverySpeed === 'priority' ? 20 : 0;
  const total = subtotal + deliveryFee + priorityFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedArea) {
      toast({
        title: 'Välj leveransområde',
        description: 'Du måste välja ett leveransområde först.',
        variant: 'destructive',
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: 'Varukorgen är tom',
        description: 'Lägg till produkter i varukorgen först.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: 'TEMP', // Will be overwritten by trigger
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_email: formData.email,
          delivery_address: formData.address,
          delivery_area_id: selectedArea.id,
          delivery_speed: deliverySpeed,
          notes: formData.notes || null,
          subtotal,
          delivery_fee: deliveryFee,
          priority_fee: priorityFee,
          total,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      clearCart();
      navigate(`/confirmation/${order.order_number}`);
    } catch (error) {
      console.error('Order error:', error);
      toast({
        title: 'Något gick fel',
        description: 'Kunde inte skapa beställningen. Försök igen.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Logo size="sm" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
        <h1 className="text-2xl font-bold">Slutför beställning</h1>

        {/* Customer Info */}
        <div className="glass-card p-6 rounded-xl space-y-4">
          <h2 className="font-semibold">Dina uppgifter</h2>

          <div className="space-y-2">
            <Label htmlFor="name">Namn</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ditt namn"
              required
              className="bg-secondary border-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="07X XXX XX XX"
              required
              className="bg-secondary border-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-post</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="din@email.se"
              required
              className="bg-secondary border-none"
            />
          </div>
        </div>

        {/* Delivery */}
        <div className="glass-card p-6 rounded-xl space-y-4">
          <h2 className="font-semibold">Leverans</h2>

          <div className="space-y-2">
            <Label htmlFor="address">Adress</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Gatuadress, postnummer, ort"
              required
              className="bg-secondary border-none"
            />
          </div>

          <div className="space-y-2">
            <Label>Leveransområde</Label>
            <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
              <span>{selectedArea?.name ?? 'Ej valt'}</span>
              <span className="text-muted-foreground ml-auto">
                {deliveryFee} kr
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Leveranshastighet</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliverySpeed('standard')}
                className={cn(
                  'p-4 rounded-xl border text-left transition-all',
                  deliverySpeed === 'standard'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Standard</span>
                </div>
                <p className="text-sm text-muted-foreground">20-30 min</p>
                <p className="text-sm text-primary font-medium mt-1">Gratis</p>
              </button>

              <button
                type="button"
                onClick={() => setDeliverySpeed('priority')}
                className={cn(
                  'p-4 rounded-xl border text-left transition-all',
                  deliverySpeed === 'priority'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="font-medium">Prioriterad</span>
                </div>
                <p className="text-sm text-muted-foreground">10-20 min</p>
                <p className="text-sm text-primary font-medium mt-1">+20 kr</p>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Anteckningar (valfritt)</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="T.ex. portkod, instruktioner till föraren..."
              className="bg-secondary border-none min-h-20"
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="glass-card p-6 rounded-xl space-y-3">
          <h2 className="font-semibold">Ordersammanfattning</h2>

          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>
                {item.quantity}x {item.name}
              </span>
              <span>{item.price * item.quantity} kr</span>
            </div>
          ))}

          <div className="border-t border-border pt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delsumma</span>
              <span>{subtotal} kr</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Leverans</span>
              <span>{deliveryFee} kr</span>
            </div>
            {priorityFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Prioriterad leverans</span>
                <span>{priorityFee} kr</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
              <span>Totalt</span>
              <span className="text-primary">{total} kr</span>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full h-14 text-lg font-bold"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Beställer...
            </>
          ) : (
            `Beställ för ${total} kr`
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Genom att beställa godkänner du våra villkor. Betalning sker vid leverans.
        </p>
      </form>
    </div>
  );
}
