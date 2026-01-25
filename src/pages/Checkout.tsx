import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Check, Loader2, CreditCard, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Layout } from '@/components/Layout';
import { useCart } from '@/hooks/useCart';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DELIVERY_SPEED_TIMES, DeliveryArea } from '@/types/database';

// Map frontend delivery area keys to database names
const AREA_NAME_MAP: Record<DeliveryArea, string> = {
  jarfalla: 'Järfälla',
  upplands_bro: 'Upplands Bro',
  stockholm: 'Husby/Akalla/Kista',
};

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, deliveryArea, deliverySpeed, deliveryFee, priorityFee, total, clearCart } = useCart();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryAreaId, setDeliveryAreaId] = useState<string | null>(null);
  const [deliveryAreaName, setDeliveryAreaName] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });

  // Fetch the delivery area ID from database
  useEffect(() => {
    async function fetchDeliveryAreaId() {
      if (!deliveryArea) return;
      
      const areaName = AREA_NAME_MAP[deliveryArea];
      const { data, error } = await supabase
        .from('delivery_areas')
        .select('id, name')
        .eq('name', areaName)
        .maybeSingle();
      
      if (data && !error) {
        setDeliveryAreaId(data.id);
        setDeliveryAreaName(data.name);
      }
    }
    
    fetchDeliveryAreaId();
  }, [deliveryArea]);

  if (items.length === 0 || !deliveryArea) {
    return (
      <Layout>
        <div className="container px-4 py-16 text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Din varukorg är tom</h1>
          <p className="text-muted-foreground mb-6">Lägg till produkter för att beställa</p>
          <Link to="/menu">
            <Button className="snaxo-gradient text-white">Se menyn</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      toast.error('Fyll i alla obligatoriska fält');
      return;
    }

    if (!deliveryAreaId) {
      toast.error('Kunde inte hitta leveransområde. Försök igen.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          delivery_address: formData.address,
          delivery_area_id: deliveryAreaId,
          delivery_speed: deliverySpeed,
          delivery_fee: deliveryFee,
          priority_fee: priorityFee,
          subtotal,
          total,
          notes: formData.notes || null,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Send order confirmation emails
      try {
        const emailPayload = {
          orderNumber: order.order_number,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          deliveryAddress: formData.address,
          deliveryArea: deliveryAreaName,
          deliverySpeed,
          deliveryFee,
          priorityFee,
          subtotal,
          total,
          notes: formData.notes || null,
          items: items.map((item) => ({
            product_name: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
          })),
        };

        const { error: emailError } = await supabase.functions.invoke('send-order-emails', {
          body: emailPayload,
        });

        if (emailError) {
          console.error('Email error:', emailError);
          // Don't fail the order if email fails
        }
      } catch (emailErr) {
        console.error('Failed to send order emails:', emailErr);
        // Don't fail the order if email fails
      }

      // Clear cart and redirect to confirmation
      clearCart();
      navigate(`/order-bekraftelse?order=${order.id}`);
      
    } catch (error) {
      console.error('Order error:', error);
      toast.error('Kunde inte skapa beställningen. Försök igen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container px-4 py-8 md:py-12">
        <Link to="/varukorg" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Tillbaka till varukorgen
        </Link>

        <h1 className="font-display text-3xl font-bold mb-8">Kassa</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left side - Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Customer Details */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <h2 className="font-display text-xl font-bold mb-4">Dina uppgifter</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Namn *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ditt namn"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">E-post *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="din@epost.se"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefon *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="070-123 45 67"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Leveransadress *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Gatuadress, postnummer, ort"
                      required
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="notes">Meddelande (valfritt)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="T.ex. portkod, leveransinstruktioner..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <h2 className="font-display text-xl font-bold mb-4">Betalning</h2>
                
                <div className="flex items-center gap-4 p-4 rounded-lg border border-primary bg-primary/5">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-6 w-6 text-primary" />
                    <Wallet className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Betala vid leverans</p>
                    <p className="text-sm text-muted-foreground">Apple Pay, kort eller Revolut när du får din beställning</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl p-6 border border-border sticky top-24">
                <h2 className="font-display text-xl font-bold mb-4">Din beställning</h2>
                
                <div className="space-y-3 mb-4">
                  {items.map(item => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.product.name}</span>
                      <span>{(item.product.price * item.quantity).toFixed(0)} kr</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Delsumma</span>
                    <span>{subtotal.toFixed(0)} kr</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Leverans ({deliveryAreaName || '...'})</span>
                    <span>{deliveryFee} kr</span>
                  </div>
                  {priorityFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Prioritering ({DELIVERY_SPEED_TIMES.priority})</span>
                      <span>{priorityFee} kr</span>
                    </div>
                  )}
                  {deliverySpeed === 'standard' && (
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Leveranstid</span>
                      <span>{DELIVERY_SPEED_TIMES.standard}</span>
                    </div>
                  )}
                  <div className="border-t border-border pt-2 flex justify-between font-display font-bold text-lg">
                    <span>Totalt</span>
                    <span className="text-primary">{total.toFixed(0)} kr</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full snaxo-gradient text-white mt-6"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Bearbetar...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-5 w-5" />
                      Bekräfta beställning
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-3">
                  Du betalar när leveransen anländer.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
