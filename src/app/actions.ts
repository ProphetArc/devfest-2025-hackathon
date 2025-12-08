'use server';

import { expandSearch } from '@/ai/flows/expand-search-with-ai';
import type { DataItem } from '@/lib/data';
import { pavlodarData } from '@/lib/data';

export async function searchAction(query: string): Promise<DataItem[]> {
  if (!query) {
    return [];
  }
  const lowerCaseQuery = query.toLowerCase();
  
  const results = pavlodarData.filter(item => 
    item.name.toLowerCase().includes(lowerCaseQuery) ||
    item.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
  );

  await new Promise(resolve => setTimeout(resolve, 500));

  return results;
}

export async function expandAction(
  item: DataItem,
  userInput: string
): Promise<string> {
    if (!userInput) {
        return "Пожалуйста, задайте вопрос.";
    }

    const searchResults = `
        Название: ${item.name}
        Тип: ${item.type}
        Описание: ${item.description}
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
        return "Извините, произошла ошибка при обращении к ИИ. Попробуйте позже.";
    }
}
