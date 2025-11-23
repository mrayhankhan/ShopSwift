// import {genkit} from 'genkit';
// import {googleAI} from '@genkit-ai/google-genai';

// export const ai = genkit({
//   plugins: [googleAI()],
//   model: 'googleai/gemini-2.5-flash',
// });

// Mock AI to prevent crash on Node 25 / Next.js 15
export const ai = {
  definePrompt: (config: any) => async (input: any) => {
    return {
      output: {
        estimatedTime: "15-25 minutes",
        confidence: 0.8
      }
    };
  },
  defineFlow: (config: any, handler: any) => handler,
};
