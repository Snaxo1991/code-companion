import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'text-2xl',
  md: 'text-4xl',
  lg: 'text-5xl',
  xl: 'text-7xl',
};

export function Logo({ size = 'md', showTagline = false, className }: LogoProps) {
  return (
    <div className={cn('text-center', className)}>
      <h1 className={cn('font-black tracking-tight gradient-text', sizeClasses[size])}>
        SNAXO
      </h1>
      {showTagline && (
        <p className="text-muted-foreground text-sm mt-1 tracking-widest uppercase">
          Tugga nu, tänk sen
        </p>
      )}
    </div>
  );
}
