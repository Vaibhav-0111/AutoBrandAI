'use server';
/**
 * @fileOverview Generates a logo using an AI image generation model.
 *
 * - generateLogo - A function that handles the logo generation.
 * - GenerateLogoInput - The input type for the generateLogo function.
 * - GenerateLogoOutput - The return type for the generateLogo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLogoInputSchema = z.object({
  description: z.string().describe('A description of the business or brand for the logo.'),
});
export type GenerateLogoInput = z.infer<typeof GenerateLogoInputSchema>;

const GenerateLogoOutputSchema = z.object({
  logoDataUri: z.string().describe('The generated logo as a data URI.'),
});
export type GenerateLogoOutput = z.infer<typeof GenerateLogoOutputSchema>;

export async function generateLogo(input: GenerateLogoInput): Promise<GenerateLogoOutput> {
  return generateLogoFlow(input);
}

const promptTemplate = `
You are a professional logo designer. Your task is to create a modern, clean, and minimalist vector-style logo based on the user's business description.

**Business Description:** {{{description}}}

**Instructions:**
1.  Create a simple, iconic, and memorable logo.
2.  The logo should be in a vector art style (flat colors, clean lines).
3.  Do NOT include any text in the logo. It should be a symbol or icon only.
4.  The background must be a solid white color.
5.  The output must be a square image.
`;

const generateLogoFlow = ai.defineFlow(
  {
    name: 'generateLogoFlow',
    inputSchema: GenerateLogoInputSchema,
    outputSchema: GenerateLogoOutputSchema,
  },
  async (input) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: promptTemplate.replace('{{{description}}}', input.description),
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media.url) {
        throw new Error('Logo generation failed to return a data URI.');
    }

    return { logoDataUri: media.url };
  }
);
