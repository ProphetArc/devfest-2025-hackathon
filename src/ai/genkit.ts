import {genkit, Plugin} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {next} from '@genkit-ai/next';

const MockPlugin = (name: string): Plugin<any> => {
  return {
    name: `genkit/${name}`,
    configure: async () => {},
  };
};

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
    next({
      // @ts-ignore
      development: process.env.NODE_ENV === 'development',
    }),
  ],
  model: 'googleai/gemini-2.5-flash',
  enableTracingAndMetrics: true,
  logLevel: 'debug',
});
