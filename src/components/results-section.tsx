import type { DataItem } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { IconForItemType } from '@/components/icons';
import { type Language, uiTexts } from '@/lib/i18n';

type ResultsSectionProps = {
  results: DataItem[];
  onSelect: (item: DataItem) => void;
  isSearching: boolean;
  querySubmitted: boolean;
  lang: Language;
};

export function ResultsSection({ results, onSelect, isSearching, querySubmitted, lang }: ResultsSectionProps) {
  const texts = uiTexts[lang];
  
  if (isSearching) {
    return (
      <div className="grid gap-4 animate-in fade-in-0 duration-500">
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-lg" />)}
      </div>
    );
  }

  if (querySubmitted && results.length === 0) {
    return (
      <div className="text-center py-10">
          <p className="text-muted-foreground">{texts.noResults}</p>
      </div>
    );
  }
  
  if (results.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 animate-in fade-in-0 duration-500">
      {results.map((item) => {
        const currentLangItem = item[lang];
        return (
            <Card
              key={item.id}
              className="cursor-pointer transition-all hover:border-primary hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onClick={() => onSelect(item)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(item); }}
              tabIndex={0}
              role="button"
              aria-label={`Learn more about ${currentLangItem.name}`}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <IconForItemType type={item.type} className="h-8 w-8 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-headline text-lg font-semibold">{currentLangItem.name}</h3>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{currentLangItem.description}</p>
                </div>
              </CardContent>
            </Card>
        )
      })}
    </div>
  );
}
