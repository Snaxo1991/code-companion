import { MapPin, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDeliveryArea } from '@/hooks/useDeliveryArea';
import { cn } from '@/lib/utils';

interface Area {
  id: string;
  name: string;
  fee: number;
}

interface AreaSelectorProps {
  areas: Area[];
  onSelect?: () => void;
}

export function AreaSelector({ areas, onSelect }: AreaSelectorProps) {
  const { selectedArea, setSelectedArea } = useDeliveryArea();

  const handleSelect = (area: Area) => {
    setSelectedArea(area);
    onSelect?.();
  };

  return (
    <div className="space-y-3">
      {areas.map((area) => {
        const isSelected = selectedArea?.id === area.id;
        return (
          <Button
            key={area.id}
            variant="outline"
            className={cn(
              'w-full h-auto py-4 px-4 justify-between text-left',
              isSelected && 'border-primary bg-primary/10'
            )}
            onClick={() => handleSelect(area)}
          >
            <div className="flex items-center gap-3">
              <MapPin className={cn('h-5 w-5', isSelected ? 'text-primary' : 'text-muted-foreground')} />
              <span className="font-medium">{area.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground">{area.fee} kr</span>
              {isSelected && <Check className="h-5 w-5 text-primary" />}
            </div>
          </Button>
        );
      })}
    </div>
  );
}
