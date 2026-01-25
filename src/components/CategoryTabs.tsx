import { cn } from '@/lib/utils';

type Category = 'all' | 'drycker' | 'fryst' | 'snacks' | 'deals';

interface CategoryTabsProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
}

const categories: { value: Category; label: string; emoji: string }[] = [
  { value: 'all', label: 'Alla', emoji: '🔥' },
  { value: 'drycker', label: 'Drycker', emoji: '🥤' },
  { value: 'fryst', label: 'Fryst', emoji: '🍦' },
  { value: 'snacks', label: 'Snacks', emoji: '🍿' },
  { value: 'deals', label: 'Deals', emoji: '💰' },
];

export function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
      {categories.map(({ value, label, emoji }) => (
        <button
          key={value}
          onClick={() => onCategoryChange(value)}
          className={cn(
            'flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all shadow-sm',
            activeCategory === value
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md scale-105'
              : 'bg-card text-foreground hover:bg-card/80 border border-border/50'
          )}
        >
          <span className="text-lg">{emoji}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
