// The `use server` directive is necessary to inform the Next.js runtime that this code should only be executed on the server.
'use server';
/**
 * @fileOverview Generates a branded asset (e.g., business card, social media post) using image generation.
 *
 * - generateBrandedAsset - A function that handles the asset generation.
 * - GenerateBrandedAssetInput - The input type for the generateBrandedAsset function.
 * - GenerateBrandedAssetOutput - The return type for the generateBrandedAsset function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBrandedAssetInputSchema = z.object({
  assetType: z.string().describe('The type of asset to generate (e.g., Business Card, Instagram Post).'),
  colorPalette: z.array(z.string()).describe('An array of color hex codes representing the brand color palette.'),
  fontStyle: z.string().describe('The name of the font style to apply.'),
  brandTone: z.string().describe('A description of the brand tone (e.g., modern, playful, minimal).'),
  businessType: z.string().describe('The type of business (e.g., Food, Fitness).'),
});
export type GenerateBrandedAssetInput = z.infer<typeof GenerateBrandedAssetInputSchema>;

const GenerateBrandedAssetOutputSchema = z.object({
  assetDataUri: z.string().describe('The generated asset as a data URI.'),
});
export type GenerateBrandedAssetOutput = z.infer<typeof GenerateBrandedAssetOutputSchema>;

export async function generateBrandedAsset(input: GenerateBrandedAssetInput): Promise<GenerateBrandedAssetOutput> {
  return generateBrandedAssetFlow(input);
}

const promptTemplate = `
You are a professional designer creating a branded asset.

**Asset Type:** {{{assetType}}}
**Business Type:** {{{businessType}}}
**Color Palette:** {{#each colorPalette}}{{{this}}}{{/each}}
**Font Style:** {{{fontStyle}}}
**Brand Tone:** {{{brandTone}}}

Based on the provided brand guidelines, create a visually appealing and professional {{{assetType}}} design. The design should be clean, modern, and suitable for the specified business type.
Ensure the text is legible and the color palette is used effectively. For a business card, include placeholder text for a name, title, phone number, and email.
`;

const generateBrandedAssetFlow = ai.defineFlow(
  {
    name: 'generateBrandedAssetFlow',
    inputSchema: GenerateBrandedAssetInputSchema,
    outputSchema: GenerateBrandedAssetOutputSchema,
  },
  async (input) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: promptTemplate,
      context: input,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media.url) {
        throw new Error('Image generation failed to return a data URI.');
    }

    return { assetDataUri: media.url };
  }
);
