
// src/ai/flows/assistant-chat.ts
'use server';

/**
 * @fileOverview A general-purpose AI chat assistant for CampusCompanion.
 *
 * - assistantChat - A function that handles chat interactions.
 * - AssistantChatInput - The input type for the assistantChat function.
 * - AssistantChatOutput - The return type for the assistantChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the structure for a single message part (in this case, just text)
const MessagePartSchema = z.object({
  text: z.string(),
});

// Define the structure for a single message in the history
const HistoryMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.array(MessagePartSchema),
});
export type HistoryMessage = z.infer<typeof HistoryMessageSchema>;


const AssistantChatInputSchema = z.object({
  query: z.string().describe("The user's latest message."),
  history: z.array(HistoryMessageSchema).describe('The conversation history.'),
});
export type AssistantChatInput = z.infer<typeof AssistantChatInputSchema>;

const AssistantChatOutputSchema = z.object({
  response: z.string().describe("The AI's response to the user's query."),
});
export type AssistantChatOutput = z.infer<typeof AssistantChatOutputSchema>;


export async function assistantChat(input: AssistantChatInput): Promise<AssistantChatOutput> {
  return assistantChatFlow(input);
}

const assistantPrompt = ai.definePrompt({
  name: 'assistantPrompt',
  model: 'googleai/gemini-1.0-pro',
  system: `You are CampusCompanion AI, a friendly and helpful assistant for college students. 
      Your goal is to provide accurate and concise information related to academics, placements, and campus life. 
      Keep your responses helpful and encouraging.
      If a question is outside of your scope as a campus assistant, politely decline to answer.`,
  messages: [{role: 'user', content: [{text: '{{message}}'}]}],
});


const assistantChatFlow = ai.defineFlow(
  {
    name: 'assistantChatFlow',
    inputSchema: AssistantChatInputSchema,
    outputSchema: AssistantChatOutputSchema,
  },
  async ({ query, history }) => {
    
    const llmResponse = await assistantPrompt({
        history: history,
        message: query,
    });

    const responseText = llmResponse.text;

    return { response: responseText };
  }
);
