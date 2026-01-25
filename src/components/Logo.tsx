import { cn } from '@/lib/utils';
import snaxoLogo from '@/assets/snaxo-logo.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'h-12',
  md: 'h-20',
  lg: 'h-28',
  xl: 'h-40',
};

export function Logo({ size = 'md', showTagline = false, className }: LogoProps) {
  return (
    <div className={cn('flex flex-col items-center', className)}>
      <img 
        src={snaxoLogo} 
        alt="SNAXO - Snacksleverans" 
        className={cn('object-contain', sizeClasses[size])}
      />
      {showTagline && (
        <p className="text-muted-foreground text-sm mt-2 tracking-widest uppercase font-medium">
          Tugga nu, tänk sen
        </p>
      )}
    </div>
  );
}
