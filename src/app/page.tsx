'use client';

import { useState, useTransition, type FormEvent, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { expandAction, searchAction } from '@/app/actions';
import type { DataItem } from '@/lib/data';
import { SearchSection } from '@/components/search-section';
import { ResultsSection } from '@/components/results-section';
import { DetailsSection } from '@/components/details-section';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { uiTexts, type Language } from '@/lib/i18n';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DataItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);
  const [aiConversation, setAiConversation] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [querySubmitted, setQuerySubmitted] = useState(false);
  const [lang, setLang] = useState<Language>('ru');

  const [isSearching, startSearchTransition] = useTransition();
  const [isThinking, startAiTransition] = useTransition();

  const { toast } = useToast();
  const texts = uiTexts[lang];

  const handleSearch = useCallback((e: FormEvent<HTMLFormElement>, suggestionQuery?: string) => {
    e.preventDefault();
    const currentQuery = suggestionQuery || query;
    if (!currentQuery.trim()) {
      setResults([]);
      setQuerySubmitted(false);
      return;
    };
    
    setSelectedItem(null);
    setResults([]);
    setQuerySubmitted(true);
    startSearchTransition(async () => {
      const searchResults = await searchAction(currentQuery, lang);
      setResults(searchResults);
    });
  }, [query, lang]);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      setQuerySubmitted(false);
    } else {
        const handler = setTimeout(() => {
            startSearchTransition(async () => {
                const searchResults = await searchAction(query, lang);
                setResults(searchResults);
                setQuerySubmitted(true);
            });
        }, 300); // Debounce time

        return () => {
            clearTimeout(handler);
        };
    }
}, [query, lang]);


  const handleSelectResult = (item: DataItem) => {
    setSelectedItem(item);
    setAiConversation([{role: 'ai', content: uiTexts[lang].aiAskAbout}]);
    setAiInput('');
  };

  const handleBackToResults = () => {
    setSelectedItem(null);
    setAiConversation([]);
    setAiInput('');
    if(!query) {
      setResults([]);
      setQuerySubmitted(false);
    }
  };
  
  const handleAiQuery = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!aiInput.trim() || !selectedItem) return;
    
    const userInput = aiInput;
    const currentLangItem = selectedItem[lang];

    setAiConversation(prev => [...prev.filter(m => m.role !== 'ai' || m.content !== uiTexts[lang].aiAskAbout), { role: 'user' as const, content: userInput }]);
    setAiInput('');

    startAiTransition(async () => {
        try {
            const aiResponse = await expandAction(currentLangItem, userInput, lang);
            setAiConversation(prev => [...prev, { role: 'ai' as const, content: aiResponse }]);
        } catch (error) {
            toast({
              variant: "destructive",
              title: texts.aiErrorTitle,
              description: texts.aiErrorDescription,
            });
            setAiConversation(prev => prev.slice(0, -1));
        }
    });
  };

  const toggleLanguage = () => {
    const newLang = lang === 'ru' ? 'en' : 'ru';
    setLang(newLang);
    // If we are on the details page, update the AI conversation to the new language
    if(selectedItem) {
        setAiConversation(prev => {
            if(prev.length === 1 && prev[0].role === 'ai') {
                return [{role: 'ai', content: uiTexts[newLang].aiAskAbout}];
            }
            return prev;
        });
    } else if (query) {
       // Re-run search in the new language if there was a query
       startSearchTransition(async () => {
        const searchResults = await searchAction(query, newLang);
        setResults(searchResults);
      });
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-body">
      <header className="sticky top-0 z-10 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <h1 className="font-headline text-2xl font-bold text-primary sm:text-3xl">Вектор</h1>
          <div className="flex items-center gap-2">
            <p className="hidden text-sm text-muted-foreground sm:block">{texts.appSubtitle}</p>
            <Button variant="ghost" className="h-auto px-2 py-1" onClick={toggleLanguage} aria-label="Switch language">
                <Globe className="h-5 w-5"/>
                <span className="ml-2 font-semibold">{lang.toUpperCase()}</span>
            </Button>
          </div>
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
              lang={lang}
            />
          ) : (
            <>
              <SearchSection onSearch={handleSearch} query={query} setQuery={setQuery} isSearching={isSearching} lang={lang} />
              <ResultsSection results={results} onSelect={handleSelectResult} isSearching={isSearching} querySubmitted={querySubmitted} lang={lang} />
            </>
          )}
        </div>
      </main>

      <footer className="w-full border-t bg-card">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground md:px-6">
          {texts.footerText.replace('{year}', new Date().getFullYear().toString())}
        </div>
      </footer>
    </div>
  );
}
