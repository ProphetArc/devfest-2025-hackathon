'use client';
import {runFlow} from '@genkit-ai/next/client';
import type {ExpandSearchInput} from '@/ai/flows/expand-search-with-ai';
import {expandSearchFlow} from '@/ai/flows/expand-search-with-ai';
import type {VectorSearchInput} from '@/ai/flows/vector-search-flow';
import {vectorSearchFlow} from '@/ai/flows/vector-search-flow';
import type {DataItem, LocalizedContent} from '@/lib/data';
import {pavlodarData} from '@/lib/data';
import type {Language} from '@/lib/i18n';
import {uiTexts} from '@/lib/i18n';

// When building for static export (like GitHub Pages), Server Actions are not supported directly.
// We add a check to bypass the AI calls during the build process on GitHub Actions.
const isStaticExportBuild = process.env.GITHUB_ACTIONS === 'true';

export async function searchAction(query: string, lang: Language): Promise<DataItem[]> {
  if (isStaticExportBuild) {
    console.log('Skipping vector search during static export build.');
    // Fallback to simple text search during static build
    const lowerCaseQuery = query.toLowerCase();
    return pavlodarData.filter(item => {
      const localized = item[lang];
      return (
        localized.name.toLowerCase().includes(lowerCaseQuery) ||
        localized.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
      );
    });
  }

  if (!query) {
    return [];
  }

  try {
    const searchResults = await runFlow(vectorSearchFlow, {
      query: query,
      data: pavlodarData,
      lang: lang,
    } as VectorSearchInput);

    // The flow returns sorted IDs. We need to map them back to the original data items
    // while preserving the order.
    const resultsMap = new Map(pavlodarData.map(item => [item.id, item]));
    const orderedResults = searchResults.results.map(id => resultsMap.get(id)).filter(Boolean) as DataItem[];

    return orderedResults;
  } catch (error) {
    console.error('Vector search failed, falling back to simple search:', error);
    // Fallback to simple text search if AI search fails
    const lowerCaseQuery = query.toLowerCase();
    const results = pavlodarData.filter(item => {
      const localized = item[lang];
      return (
        localized.name.toLowerCase().includes(lowerCaseQuery) ||
        localized.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
      );
    });
    return results;
  }
}

export async function expandAction(
  item: LocalizedContent,
  userInput: string,
  lang: Language
): Promise<string> {
   if (isStaticExportBuild) {
    console.log('Skipping AI expansion during static export build.');
    return uiTexts[lang].expandActionError;
  }

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
    const response = await runFlow(expandSearchFlow, {
      searchTerm: item.name,
      searchResults,
      userInput,
    } as ExpandSearchInput);
    return response.expandedContent;
  } catch (error) {
    console.error('AI expansion failed:', error);
    return texts.expandActionError;
  }
}
