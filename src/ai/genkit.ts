import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// --- IMPORTANT ---
// Please replace the placeholder value below with your actual Gemini API key.
// You can get a key from Google AI Studio.
const geminiApiKey = "YOUR_GEMINI_API_KEY_HERE";

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: geminiApiKey,
    }),
  ],
  model: 'googleai/gemini-1.5-pro',
});
