'use server';
/**
 * @fileOverview A conversational AI flow for a branding expert chatbot.
 *
 * - brandExpertChat - A function that handles a user's chat message.
 * - BrandExpertChatInput - The input type for the brandExpertChat function.
 * - BrandExpertChatOutput - The return type for the brandExpertChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BrandExpertChatInputSchema = z.object({
  question: z.string().describe('The user\'s question for the branding expert.'),
});
export type BrandExpertChatInput = z.infer<typeof BrandExpertChatInputSchema>;

const BrandExpertChatOutputSchema = z.object({
  answer: z.string().describe('The branding expert\'s answer to the question.'),
});
export type BrandExpertChatOutput = z.infer<typeof BrandExpertChatOutputSchema>;

export async function brandExpertChat(input: BrandExpertChatInput): Promise<BrandExpertChatOutput> {
  return brandExpertChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'brandExpertChatPrompt',
  input: {schema: BrandExpertChatInputSchema},
  output: {schema: BrandExpertChatOutputSchema},
  prompt: `You are "BrandBot", a friendly and helpful AI branding expert. Your goal is to assist users of the AutoBrand AI application.

You can answer questions about:
- General branding principles (e.g., color theory, typography, brand voice).
- How to use the AutoBrand AI tool.
- Suggestions for marketing and design.

Keep your answers concise, encouraging, and easy to understand.

User's question: {{{question}}}
`,
});

const brandExpertChatFlow = ai.defineFlow(
  {
    name: 'brandExpertChatFlow',
    inputSchema: BrandExpertChatInputSchema,
    outputSchema: BrandExpertChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
