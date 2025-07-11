// src/ai/flows/generate-social-media-headers.ts
'use server';
/**
 * @fileOverview Flow to generate social media headers based on the user's brand.
 *
 * - generateSocialMediaHeaders - A function that generates social media headers.
 * - GenerateSocialMediaHeadersInput - The input type for the generateSocialMediaHeaders function.
 * - GenerateSocialMediaHeadersOutput - The return type for the generateSocialMediaHeaders function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSocialMediaHeadersInputSchema = z.object({
  logoDataUri: z
    .string()
    .describe(
      "A photo of a logo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  businessType: z.string().describe('The type of business, e.g., Food, Fitness, etc.'),
});

export type GenerateSocialMediaHeadersInput = z.infer<typeof GenerateSocialMediaHeadersInputSchema>;

const GenerateSocialMediaHeadersOutputSchema = z.object({
  headerSuggestions: z.array(z.string()).describe('An array of suggested social media headers.'),
});

export type GenerateSocialMediaHeadersOutput = z.infer<typeof GenerateSocialMediaHeadersOutputSchema>;

export async function generateSocialMediaHeaders(input: GenerateSocialMediaHeadersInput): Promise<GenerateSocialMediaHeadersOutput> {
  return generateSocialMediaHeadersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSocialMediaHeadersPrompt',
  input: {schema: GenerateSocialMediaHeadersInputSchema},
  output: {schema: GenerateSocialMediaHeadersOutputSchema},
  prompt: `You are a social media expert who specializes in creating cohesive brand identities.

  Based on the user's logo and business type, you will suggest a set of social media headers that are cohesive with their brand.
  The social media headers suggested should be highly engaging and visually appealing.

  Logo: {{media url=logoDataUri}}
  Business Type: {{{businessType}}}

  Return an array of suggested social media headers. Limit this to 5 suggestions.
  `,
});

const generateSocialMediaHeadersFlow = ai.defineFlow(
  {
    name: 'generateSocialMediaHeadersFlow',
    inputSchema: GenerateSocialMediaHeadersInputSchema,
    outputSchema: GenerateSocialMediaHeadersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
