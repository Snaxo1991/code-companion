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
  hero: 'h-72 sm:h-96 w-auto max-w-full',
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
        <p className="text-foreground/80 text-xl sm:text-2xl mt-4 tracking-widest uppercase font-bold">
          Tugga nu, tänk sen
        </p>
      )}
    </div>
  );
}
