'use server';

/**
 * @fileOverview An AI agent that performs semantic search using vector embeddings.
 *
 * - vectorSearch - A function that finds relevant items from a dataset based on a query.
 * - VectorSearchInput - The input type for the vectorSearch function.
 * - VectorSearchOutput - The return type for the vectorSearch function.
 */

import {ai} from '@/ai/genkit';
import {embed} from 'genkit';
import {z} from 'genkit';
import {cosineSimilarity} from '../utils';
import type {DataItem} from '@/lib/data';
import {translateType} from '@/components/icons';

// Define the structure for a single item, which can be complex
const DataItemSchema = z.any();

const VectorSearchInputSchema = z.object({
  query: z.string().describe("The user's search query."),
  data: z.array(DataItemSchema).describe('The dataset to search through.'),
  lang: z.enum(['ru', 'en']).describe('The language of the query and data.'),
});
export type VectorSearchInput = z.infer<typeof VectorSearchInputSchema>;

const VectorSearchOutputSchema = z.object({
  results: z.array(z.string()).describe('An array of item IDs, sorted by relevance.'),
});
export type VectorSearchOutput = z.infer<typeof VectorSearchOutputSchema>;

export async function vectorSearch(
  {query, data, lang}: VectorSearchInput
): Promise<VectorSearchOutput> {
    // 1. Generate embedding for the user's query
    const queryEmbedding = await embed({
      embedder: 'googleai/embedding-001',
      content: query,
    });

    // 2. Generate embeddings for each item in the dataset.
    // For each item, we create a rich text representation to be embedded.
    const documents = (data as DataItem[]).map(item => {
      const localized = item[lang];
      const itemType = translateType(item.type, lang);
      // Combine name, type, tags and the full knowledge base for a rich semantic representation.
      const textToEmbed = `Тип: ${itemType}. Название: ${localized.name}. Теги: ${localized.tags.join(', ')}. Описание: ${localized.knowledge}`;
      return {id: item.id, text: textToEmbed};
    });

    const documentEmbeddings = await Promise.all(
      documents.map(async doc => {
        const embedding = await embed({
          embedder: 'googleai/embedding-001',
          content: doc.text,
        });
        return {id: doc.id, embedding};
      })
    );

    // 3. Calculate cosine similarity between the query and each document
    const similarities = documentEmbeddings.map(docEmb => ({
      id: docEmb.id,
      similarity: cosineSimilarity(queryEmbedding, docEmb.embedding),
    }));

    // 4. Sort documents by similarity in descending order
    similarities.sort((a, b) => b.similarity - a.similarity);

    // 5. Filter out results with low similarity
    const relevantResults = similarities.filter(s => s.similarity > 0.75);

    return {
      results: relevantResults.map(r => r.id),
    };
}
