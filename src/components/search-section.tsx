import type { FormEvent } from 'react';
import { Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { type Language, uiTexts } from '@/lib/i18n';

type SearchSectionProps = {
  onSearch: (e: FormEvent<HTMLFormElement>, query?: string) => void;
  query: string;
  setQuery: (q: string) => void;
  isSearching: boolean;
  lang: Language;
};


export function SearchSection({ onSearch, query, setQuery, isSearching, lang }: SearchSectionProps) {
  const texts = uiTexts[lang];
  const suggestions = texts.suggestions;
  
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(new Event('submit', { cancelable: true }) as unknown as FormEvent<HTMLFormElement>, suggestion);
  };
  
  return (
    <section className="mb-12 text-center animate-in fade-in-0 duration-500">
      <h2 className="mb-2 font-headline text-4xl font-bold tracking-tight md:text-5xl">{texts.discoverTitle}</h2>
      <p className="mb-8 text-lg text-muted-foreground">{texts.discoverSubtitle}</p>
      <form onSubmit={(e) => onSearch(e)} className="relative mx-auto max-w-lg">
        <Input
          type="search"
          placeholder={texts.searchInputPlaceholder}
          className="h-12 w-full rounded-full bg-card pr-14 text-base"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isSearching}
        />
        <Button type="submit" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full" disabled={isSearching || !query.trim()}>
          {isSearching ? <Loader2 className="animate-spin" /> : <Search />}
          <span className="sr-only">{texts.searchButtonLabel}</span>
        </Button>
      </form>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <span className="text-sm text-muted-foreground">{texts.suggestionsLabel}</span>
        {suggestions.map(suggestion => (
          <Badge 
            key={suggestion} 
            variant="secondary"
            className="cursor-pointer hover:bg-primary/20"
            onClick={() => handleSuggestionClick(suggestion)}
          >
            {suggestion}
          </Badge>
        ))}
      </div>
    </section>
  );
}
