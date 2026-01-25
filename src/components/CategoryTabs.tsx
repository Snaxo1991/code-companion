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
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map(({ value, label, emoji }) => (
        <button
          key={value}
          onClick={() => onCategoryChange(value)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
            activeCategory === value
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          )}
        >
          <span>{emoji}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
