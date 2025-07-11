import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// --- IMPORTANT ---
// Please replace the placeholder value below with your actual Gemini API key.
// You can get a key from Google AI Studio.
const geminiApiKey = "AIzaSyCG-KDQ43vnVhvTyF_U_mc9YKb5kij2XZk";

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: geminiApiKey,
    }),
  ],
  model: 'googleai/gemini-1.5-flash',
});
