import type { FormEvent } from 'react';
import { Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type SearchSectionProps = {
  onSearch: (e: FormEvent<HTMLFormElement>) => void;
  query: string;
  setQuery: (q: string) => void;
  isSearching: boolean;
};

export function SearchSection({ onSearch, query, setQuery, isSearching }: SearchSectionProps) {
  return (
    <section className="mb-12 text-center animate-in fade-in-0 duration-500">
      <h2 className="mb-2 font-headline text-4xl font-bold tracking-tight md:text-5xl">Откройте для себя Павлодар</h2>
      <p className="mb-8 text-lg text-muted-foreground">Улицы, личности, история и культура.</p>
      <form onSubmit={onSearch} className="relative mx-auto max-w-lg">
        <Input
          type="search"
          placeholder="Например, 'Улица Сатпаева' или 'Павел Васильев'..."
          className="h-12 w-full rounded-full bg-card pr-14 text-base"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isSearching}
        />
        <Button type="submit" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full" disabled={isSearching || !query.trim()}>
          {isSearching ? <Loader2 className="animate-spin" /> : <Search />}
          <span className="sr-only">Поиск</span>
        </Button>
      </form>
    </section>
  );
}
