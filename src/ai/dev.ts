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
    await ai.build({
      // @ts-ignore
      target: 'nextjs',
      // @ts-ignore
      out: './.genkit-nextjs',
    });
  }
);
