// src/ai/flows/generate-social-media-posts.ts
'use server';
/**
 * @fileOverview Flow to generate social media post copy based on the user's brand.
 *
 * - generateSocialMediaPosts - A function that generates social media post copy.
 * - GenerateSocialMediaPostsInput - The input type for the generateSocialMediaPosts function.
 * - GenerateSocialMediaPostsOutput - The return type for the generateSocialMediaPosts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSocialMediaPostsInputSchema = z.object({
  logoDataUri: z
    .string()
    .describe(
      "A photo of a logo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  businessType: z.string().describe('The type of business, e.g., Food, Fitness, etc.'),
  brandTone: z.string().describe('The overall brand tone (e.g., modern, playful, minimal).'),
});

export type GenerateSocialMediaPostsInput = z.infer<typeof GenerateSocialMediaPostsInputSchema>;

const GenerateSocialMediaPostsOutputSchema = z.object({
  postSuggestions: z.array(z.string()).describe('An array of suggested social media post copy.'),
});

export type GenerateSocialMediaPostsOutput = z.infer<typeof GenerateSocialMediaPostsOutputSchema>;

export async function generateSocialMediaPosts(input: GenerateSocialMediaPostsInput): Promise<GenerateSocialMediaPostsOutput> {
  return generateSocialMediaPostsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSocialMediaPostsPrompt',
  input: {schema: GenerateSocialMediaPostsInputSchema},
  output: {schema: GenerateSocialMediaPostsOutputSchema},
  prompt: `You are a social media marketing expert who specializes in creating engaging content that builds strong brand identities.

  Based on the user's logo, business type, and brand tone, you will write a set of 3-5 social media post captions.
  These posts should be creative, engaging, and perfectly aligned with the specified brand personality.
  Include relevant hashtags and emojis where appropriate.

  Logo: {{media url=logoDataUri}}
  Business Type: {{{businessType}}}
  Brand Tone: {{{brandTone}}}

  Return an array of suggested post captions.
  `,
});

const generateSocialMediaPostsFlow = ai.defineFlow(
  {
    name: 'generateSocialMediaPostsFlow',
    inputSchema: GenerateSocialMediaPostsInputSchema,
    outputSchema: GenerateSocialMediaPostsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
