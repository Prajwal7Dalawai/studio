// src/ai/flows/suggest-placement-tips.ts
'use server';

/**
 * @fileOverview Provides personalized placement tips based on the student's year and branch.
 *
 * - suggestPlacementTips - A function that suggests placement tips.
 * - SuggestPlacementTipsInput - The input type for the suggestPlacementTips function.
 * - SuggestPlacementTipsOutput - The return type for the suggestPlacementTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const SuggestPlacementTipsInputSchema = z.object({
  year: z
    .enum(['2nd', '3rd', '4th'])
    .describe('The current year of the student (2nd, 3rd, or 4th).'),
  branch: z.string().describe('The branch of the student (e.g., CSE, ECE, MECH).'),
});

export type SuggestPlacementTipsInput = z.infer<typeof SuggestPlacementTipsInputSchema>;

const SuggestPlacementTipsOutputSchema = z.object({
  tips: z.array(z.string()).describe('An array of placement tips tailored to the student.'),
});

export type SuggestPlacementTipsOutput = z.infer<typeof SuggestPlacementTipsOutputSchema>;

export async function suggestPlacementTips(input: SuggestPlacementTipsInput): Promise<SuggestPlacementTipsOutput> {
  return suggestPlacementTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPlacementTipsPrompt',
  input: {schema: SuggestPlacementTipsInputSchema},
  output: {schema: SuggestPlacementTipsOutputSchema},
  prompt: `You are an experienced career counselor providing placement guidance to students.

  Based on the student's current year and branch, suggest relevant and actionable placement tips.
  The tips should be specific and helpful for preparing for job applications and interviews.

  Year: {{{year}}}
  Branch: {{{branch}}}

  Provide the tips as a list of strings.
  `,
});

const suggestPlacementTipsFlow = ai.defineFlow(
  {
    name: 'suggestPlacementTipsFlow',
    inputSchema: SuggestPlacementTipsInputSchema,
    outputSchema: SuggestPlacementTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
