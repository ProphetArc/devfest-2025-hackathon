'use server';

/**
 * @fileOverview An AI agent that expands on search results based on user input.
 *
 * - expandSearch - A function that handles the expansion of search results with AI.
 * - ExpandSearchInput - The input type for the expandSearch function.
 * - ExpandSearchOutput - The return type for the expandSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExpandSearchInputSchema = z.object({
  searchTerm: z.string().describe('The original search term entered by the user.'),
  searchResults: z.string().describe('The search results to expand upon.'),
  userInput: z.string().describe('The user input requesting more details or asking questions.'),
});
export type ExpandSearchInput = z.infer<typeof ExpandSearchInputSchema>;

const ExpandSearchOutputSchema = z.object({
  expandedContent: z.string().describe('The AI-expanded content based on the search results and user input.'),
});
export type ExpandSearchOutput = z.infer<typeof ExpandSearchOutputSchema>;

const prompt = ai.definePrompt({
  name: 'expandSearchPrompt',
  input: {schema: ExpandSearchInputSchema},
  output: {schema: ExpandSearchOutputSchema},
  prompt: `You are an AI assistant that expands on provided context based on user input. Use only the information from the context. Respond in the same language as the user input.

  The user is asking about "{{searchTerm}}".
  Here is the context for your reference:
  {{searchResults}}

  The user has asked the following question or requested more details:
  {{userInput}}

  Provide expanded content based on the provided context and user input.
  `,
});

export const expandSearchFlow = ai.defineFlow(
  {
    name: 'expandSearchFlow',
    inputSchema: ExpandSearchInputSchema,
    outputSchema: ExpandSearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
