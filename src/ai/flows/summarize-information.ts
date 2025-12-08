'use server';

/**
 * @fileOverview An AI agent that summarizes information about a given topic.
 *
 * - summarizeInformation - A function that summarizes information about a given topic.
 * - SummarizeInformationInput - The input type for the summarizeInformation function.
 * - SummarizeInformationOutput - The return type for the summarizeInformation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeInformationInputSchema = z.object({
  topic: z.string().describe('The topic to summarize.'),
  information: z.string().describe('Detailed information about the topic.'),
});
export type SummarizeInformationInput = z.infer<typeof SummarizeInformationInputSchema>;

const SummarizeInformationOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the information.'),
});
export type SummarizeInformationOutput = z.infer<typeof SummarizeInformationOutputSchema>;

export async function summarizeInformation(input: SummarizeInformationInput): Promise<SummarizeInformationOutput> {
  return summarizeInformationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeInformationPrompt',
  input: {schema: SummarizeInformationInputSchema},
  output: {schema: SummarizeInformationOutputSchema},
  prompt: `You are an expert summarizer.

  Summarize the following information about {{topic}}:

  {{{information}}}
  `,
});

const summarizeInformationFlow = ai.defineFlow(
  {
    name: 'summarizeInformationFlow',
    inputSchema: SummarizeInformationInputSchema,
    outputSchema: SummarizeInformationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
