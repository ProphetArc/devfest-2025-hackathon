import {config} from 'dotenv';
config();

import '@/ai/flows/summarize-information.ts';
import '@/ai/flows/expand-search-with-ai.ts';
import '@/ai/flows/vector-search-flow.ts';

import {ai} from './genkit';
import {defineFlow} from 'genkit';

export const nextBuildFlow = defineFlow(
  {
    name: 'next-build-flow',
  },
  async () => {
    // This build step is not needed for the server actions approach
  }
);
