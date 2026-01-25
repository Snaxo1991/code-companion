import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Phone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';

export default function Confirmation() {
  const { orderNumber } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-4 border-b border-border">
        <Logo size="sm" />
      </div>

      <div className="flex flex-col items-center justify-center px-6 py-16">
        <div className="relative mb-8">
          <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center animate-pulse-slow">
            <CheckCircle className="h-14 w-14 text-primary" />
          </div>
          <div className="absolute inset-0 h-24 w-24 rounded-full bg-primary/10 animate-ping" />
        </div>

        <h1 className="text-3xl font-bold mb-2 text-center">Tack för din beställning!</h1>
        <p className="text-muted-foreground text-center mb-8">
          Vi har tagit emot din order och börjar förbereda den direkt.
        </p>

        <div className="glass-card p-6 rounded-xl w-full max-w-sm text-center mb-8">
          <p className="text-sm text-muted-foreground mb-1">Ordernummer</p>
          <p className="text-2xl font-bold gradient-text">{orderNumber}</p>
        </div>

        <div className="glass-card p-6 rounded-xl w-full max-w-sm space-y-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Vi ringer när vi är framme</p>
              <p className="text-sm text-muted-foreground">
                Håll utkik efter ett samtal
              </p>
            </div>
          </div>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 w-full max-w-sm mb-8">
          <p className="text-sm text-center">
            📧 En bekräftelse har skickats till din e-post
          </p>
        </div>

        <Button
          size="lg"
          className="w-full max-w-sm"
          onClick={() => navigate('/menu')}
        >
          Beställ mer godsaker
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
