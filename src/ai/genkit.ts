import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// --- IMPORTANT ---
// The Gemini API key is loaded from an environment variable.
// Make sure to set GEMINI_API_KEY in your .env.local file.
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  console.warn("Gemini API key not found. Please set GEMINI_API_KEY in your .env.local file.");
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: geminiApiKey,
    }),
  ],
  model: 'googleai/gemini-pro',
});
