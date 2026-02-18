import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Zap, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Layout } from '@/components/Layout';
import { CartItem } from '@/components/CartItem';
import { UpsellDialog } from '@/components/UpsellDialog';
import { useCart } from '@/hooks/useCart';
import { 
  DeliveryArea, 
  DeliverySpeed,
  DELIVERY_AREA_LABELS, 
  DELIVERY_FEES,
  DELIVERY_SPEED_LABELS,
  DELIVERY_SPEED_TIMES,
  PRIORITY_FEE
} from '@/types/database';

export default function Cart() {
  const navigate = useNavigate();
  const [showUpsell, setShowUpsell] = useState(false);
  const { items, subtotal, billysDiscount, deliveryArea, setDeliveryArea, deliverySpeed, setDeliverySpeed, deliveryFee, priorityFee, total } = useCart();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container px-4 py-16 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="font-display text-2xl font-bold mb-2">Din varukorg är tom</h1>
          <p className="text-muted-foreground mb-6">Lägg till produkter för att beställa</p>
          <Link to="/menu">
            <Button className="snaxo-gradient text-white">Se menyn</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container px-4 py-8 md:py-12">
        <h1 className="font-display text-3xl font-bold mb-8">Din varukorg</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2">
            {items.map(item => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl p-6 border border-border sticky top-24">
              <h2 className="font-display text-xl font-bold mb-4">Sammanfattning</h2>
              
              <div className="mb-4">
                <label className="text-sm font-medium mb-2 block">Leveransområde</label>
                <Select value={deliveryArea || ''} onValueChange={(v) => setDeliveryArea(v as DeliveryArea)}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Välj område" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {(Object.keys(DELIVERY_AREA_LABELS) as DeliveryArea[]).map(area => (
                      <SelectItem key={area} value={area}>
                        {DELIVERY_AREA_LABELS[area]} - {DELIVERY_FEES[area]} kr
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium mb-3 block">Leveranstyp</label>
                <RadioGroup 
                  value={deliverySpeed} 
                  onValueChange={(v) => setDeliverySpeed(v as DeliverySpeed)}
                  className="space-y-3"
                >
                  <div className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${deliverySpeed === 'standard' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{DELIVERY_SPEED_LABELS.standard}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-muted-foreground">{DELIVERY_SPEED_TIMES.standard}</span>
                          <span className="ml-2 text-sm font-medium text-green-600">Gratis</span>
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${deliverySpeed === 'priority' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                    <RadioGroupItem value="priority" id="priority" />
                    <Label htmlFor="priority" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">{DELIVERY_SPEED_LABELS.priority}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-muted-foreground">{DELIVERY_SPEED_TIMES.priority}</span>
                          <span className="ml-2 text-sm font-medium text-primary">+{PRIORITY_FEE} kr</span>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Delsumma</span>
                  <span>{subtotal.toFixed(0)} kr</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Leveransavgift</span>
                  <span>{deliveryArea ? `${deliveryFee} kr` : '–'}</span>
                </div>
                {billysDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Billy's 3 för 2</span>
                    <span>-{billysDiscount} kr</span>
                  </div>
                )}
                {priorityFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Prioriteringsavgift</span>
                    <span>{priorityFee} kr</span>
                  </div>
                )}
                <div className="border-t border-border pt-2 flex justify-between font-display font-bold text-lg">
                  <span>Totalt</span>
                  <span className="text-primary">{total.toFixed(0)} kr</span>
                </div>
              </div>

              <Button 
                className="w-full snaxo-gradient text-white" 
                size="lg"
                disabled={!deliveryArea}
                onClick={() => setShowUpsell(true)}
              >
                Till kassan <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              {!deliveryArea && (
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Välj leveransområde för att fortsätta
                </p>
              )}
            </div>
          </div>
        </div>

        <UpsellDialog
          open={showUpsell}
          onOpenChange={setShowUpsell}
          onContinue={() => navigate('/kassa')}
        />
      </div>
    </Layout>
  );
}
