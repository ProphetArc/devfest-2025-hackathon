'use server';

import { expandSearch } from '@/ai/flows/expand-search-with-ai';
import type { DataItem, LocalizedContent } from '@/lib/data';
import { pavlodarData } from '@/lib/data';
import type { Language } from '@/lib/i18n';
import { uiTexts } from '@/lib/i18n';

export async function searchAction(query: string, lang: Language): Promise<DataItem[]> {
  if (!query) {
    return [];
  }
  const lowerCaseQuery = query.toLowerCase();
  
  const results = pavlodarData.filter(item => {
    const localized = item[lang];
    return localized.name.toLowerCase().includes(lowerCaseQuery) ||
           localized.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery));
  });

  await new Promise(resolve => setTimeout(resolve, 500));

  return results;
}

export async function expandAction(
  item: LocalizedContent,
  userInput: string,
  lang: Language
): Promise<string> {
    const texts = uiTexts[lang];
    if (!userInput) {
        return texts.aiInitialMessage;
    }

    // Use the detailed 'knowledge' field for the AI context
    const searchResults = `
        Name: ${item.name}
        Context: ${item.knowledge}
    `;

    try {
        const response = await expandSearch({
            searchTerm: item.name,
            searchResults,
            userInput,
        });
        return response.expandedContent;
    } catch (error) {
        console.error("AI expansion failed:", error);
        return texts.expandActionError;
    }
}
