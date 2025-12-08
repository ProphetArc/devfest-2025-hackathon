import type { FormEvent } from 'react';
import Image from 'next/image';
import { ArrowLeft, Bot, Loader2, Send, Sparkle, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import type { DataItem } from '@/lib/data';
import { cn } from '@/lib/utils';
import { IconForItemType, translateType } from '@/components/icons';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { type Language, uiTexts } from '@/lib/i18n';

type DetailsSectionProps = {
  item: DataItem;
  onBack: () => void;
  aiConversation: { role: 'user' | 'ai'; content: string }[];
  onAiQuery: (e: FormEvent<HTMLFormElement>) => void;
  aiInput: string;
  setAiInput: (s: string) => void;
  isThinking: boolean;
  lang: Language;
};

export function DetailsSection({ item, onBack, aiConversation, onAiQuery, aiInput, setAiInput, isThinking, lang }: DetailsSectionProps) {
  const heroImage = item.images && item.images.length > 0 ? item.images[0] : null;
  const galleryImages = item.images && item.images.length > 1 ? item.images.slice(0) : [];
  const currentLangItem = item[lang];
  const texts = uiTexts[lang];

  return (
    <div className="animate-in fade-in-0 duration-500">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {texts.backToResults}
      </Button>
      <Card className="overflow-hidden">
        {heroImage && (
            <div className="relative h-64 w-full bg-muted">
                <Image src={heroImage.imageUrl} alt={heroImage.description} fill className="object-cover" data-ai-hint={heroImage.imageHint} sizes="100vw" priority />
            </div>
        )}
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-secondary">
              <IconForItemType type={item.type} className="h-6 w-6 text-secondary-foreground" />
            </div>
            <div>
              <CardTitle className="font-headline text-3xl">{currentLangItem.name}</CardTitle>
              <p className="text-sm capitalize text-muted-foreground">{translateType(item.type, lang)}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-base leading-relaxed">{currentLangItem.description}</p>
          
          {galleryImages.length > 0 && (
            <div className="mt-8">
                <h4 className="font-headline text-xl font-semibold mb-4">{texts.galleryTitle}</h4>
                <Carousel className="w-full">
                    <CarouselContent>
                    {galleryImages.map((image, index) => (
                        <CarouselItem key={index} className="md:basis-1/2">
                        <div className="relative h-56 w-full bg-muted rounded-lg overflow-hidden">
                            <Image src={image.imageUrl} alt={image.description} fill className="object-cover" data-ai-hint={image.imageHint} sizes="(max-width: 768px) 100vw, 50vw" />
                        </div>
                        </CarouselItem>
                    ))}
                    </CarouselContent>
                    {galleryImages.length > 1 && (
                    <>
                        <CarouselPrevious className="absolute left-3 top-1/2 -translate-y-1/2" />
                        <CarouselNext className="absolute right-3 top-1/2 -translate-y-1/2" />
                    </>
                    )}
                </Carousel>
            </div>
          )}
          
          <div className="mt-8 pt-8 border-t">
              <h4 className="flex items-center font-headline text-2xl font-semibold mb-4">
                  <Sparkle className="mr-3 h-6 w-6 text-accent"/>
                  {texts.aiTitle}
              </h4>
              <div className="space-y-4 rounded-lg border bg-muted/20 p-4 min-h-[8rem]">
                  {aiConversation.map((msg, index) => (
                      <div key={index} className={cn("flex items-start gap-3 animate-in fade-in-0", msg.role === 'user' && "justify-end")}>
                          {msg.role === 'ai' && <Avatar className="h-8 w-8 border"><AvatarFallback className="bg-transparent"><Bot className="text-accent"/></AvatarFallback></Avatar>}
                          <div className={cn("max-w-[85%] rounded-lg p-3 text-sm shadow-sm", msg.role === 'user' ? "bg-primary text-primary-foreground" : "bg-card")}>
                              <p className="whitespace-pre-wrap">{msg.content}</p>
                          </div>
                          {msg.role === 'user' && <Avatar className="h-8 w-8 border"><AvatarFallback className="bg-transparent"><User /></AvatarFallback></Avatar>}
                      </div>
                  ))}
                  {isThinking && (
                      <div className="flex items-start gap-3 animate-in fade-in-0">
                         <Avatar className="h-8 w-8 border"><AvatarFallback className="bg-transparent"><Bot className="text-accent"/></AvatarFallback></Avatar>
                         <div className="rounded-lg p-3 bg-card shadow-sm">
                             <div className="flex items-center space-x-1">
                                <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse [animation-delay:-0.3s]"></span>
                                <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse [animation-delay:-0.15s]"></span>
                                <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse"></span>
                             </div>
                         </div>
                      </div>
                  )}
                  {aiConversation.length === 0 && !isThinking && (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                        {texts.aiAskAbout}
                    </div>
                  )}
              </div>

              <form onSubmit={onAiQuery} className="relative mt-4">
                  <Textarea 
                      placeholder={texts.aiPlaceholder.replace('{itemName}', currentLangItem.name)}
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      className="pr-14 resize-none"
                      rows={2}
                      onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              (e.target as HTMLTextAreaElement).form?.requestSubmit();
                          }
                      }}
                  />
                  <Button type="submit" variant="ghost" size="icon" className="absolute bottom-2 right-2 text-accent hover:text-accent" disabled={isThinking || !aiInput.trim()}>
                      {isThinking ? <Loader2 className="animate-spin" /> : <Send />}
                      <span className="sr-only">{texts.aiSend}</span>
                  </Button>
              </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
