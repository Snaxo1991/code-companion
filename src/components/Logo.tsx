import { cn } from '@/lib/utils';
import snaxoLogo from '@/assets/snaxo-logo.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showTagline?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'h-12',
  md: 'h-20',
  lg: 'h-28',
  xl: 'h-40',
  hero: 'h-64 sm:h-80',
};

export function Logo({ size = 'md', showTagline = false, className }: LogoProps) {
  return (
    <div className={cn('flex flex-col items-center', className)}>
      <img 
        src={snaxoLogo} 
        alt="SNAXO - Snacksleverans" 
        className={cn('object-contain drop-shadow-xl', sizeClasses[size])}
      />
      {showTagline && (
        <p className="text-foreground/70 text-base mt-3 tracking-widest uppercase font-semibold">
          Tugga nu, tänk sen
        </p>
      )}
    </div>
  );
}
