'use client';

import { useState, useTransition, type FormEvent } from 'react';
import { useToast } from '@/hooks/use-toast';
import { expandAction, searchAction } from '@/app/actions';
import type { DataItem } from '@/lib/data';
import { SearchSection } from '@/components/search-section';
import { ResultsSection } from '@/components/results-section';
import { DetailsSection } from '@/components/details-section';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DataItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);
  const [aiConversation, setAiConversation] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [querySubmitted, setQuerySubmitted] = useState(false);
  
  const [isSearching, startSearchTransition] = useTransition();
  const [isThinking, startAiTransition] = useTransition();

  const { toast } = useToast();

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setSelectedItem(null);
    setResults([]);
    setQuerySubmitted(true);
    startSearchTransition(async () => {
      const searchResults = await searchAction(query);
      setResults(searchResults);
    });
  };

  const handleSelectResult = (item: DataItem) => {
    setSelectedItem(item);
    setAiConversation([]);
    setAiInput('');
  };

  const handleBackToResults = () => {
    setSelectedItem(null);
    setAiConversation([]);
    setAiInput('');
  };
  
  const handleAiQuery = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!aiInput.trim() || !selectedItem) return;
    
    const userInput = aiInput;
    setAiConversation(prev => [...prev, { role: 'user' as const, content: userInput }]);
    setAiInput('');

    startAiTransition(async () => {
        try {
            const aiResponse = await expandAction(selectedItem, userInput);
            setAiConversation(prev => [...prev, { role: 'ai' as const, content: aiResponse }]);
        } catch (error) {
            toast({
              variant: "destructive",
              title: "Ошибка ИИ",
              description: "Не удалось получить ответ. Пожалуйста, попробуйте еще раз.",
            });
            setAiConversation(prev => prev.slice(0, -1));
        }
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-body">
      <header className="sticky top-0 z-10 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <h1 className="font-headline text-2xl font-bold text-primary sm:text-3xl">Вектор</h1>
          <p className="hidden text-sm text-muted-foreground sm:block">Культурный гид по Павлодару</p>
        </div>
      </header>

      <main className="container mx-auto flex-1 px-4 py-8 md:px-6 md:py-12">
        <div className="mx-auto max-w-3xl">
          {selectedItem ? (
            <DetailsSection
              item={selectedItem}
              onBack={handleBackToResults}
              aiConversation={aiConversation}
              onAiQuery={handleAiQuery}
              aiInput={aiInput}
              setAiInput={setAiInput}
              isThinking={isThinking}
            />
          ) : (
            <>
              <SearchSection onSearch={handleSearch} query={query} setQuery={setQuery} isSearching={isSearching} />
              <ResultsSection results={results} onSelect={handleSelectResult} isSearching={isSearching} querySubmitted={querySubmitted} />
            </>
          )}
        </div>
      </main>

      <footer className="w-full border-t bg-card">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground md:px-6">
          © {new Date().getFullYear()} Vector. Создано с любовью к Павлодару.
        </div>
      </footer>
    </div>
  );
}
