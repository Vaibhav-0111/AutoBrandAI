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
import Handlebars from 'handlebars';

const GenerateBrandedAssetInputSchema = z.object({
  assetType: z.string().describe('The type of asset to generate (e.g., Business Card, Instagram Post).'),
  colorPalette: z.array(z.string()).describe('An array of color hex codes representing the brand color palette.'),
  fontStyle: z.string().describe('The name of the font style to apply.'),
  brandTone: z.string().describe('A description of the brand tone (e.g., modern, playful, minimal).'),
  businessType: z.string().describe('The type of business (e.g., Food, Fitness).'),
  brandName: z.string().optional().describe('The name of the brand or company.'),
  phone: z.string().optional().describe('The contact phone number.'),
  email: z.string().optional().describe('The contact email address.'),
});
export type GenerateBrandedAssetInput = z.infer<typeof GenerateBrandedAssetInputSchema>;

const GenerateBrandedAssetOutputSchema = z.object({
  assetDataUri: z.string().describe('The generated asset as a data URI.'),
});
export type GenerateBrandedAssetOutput = z.infer<typeof GenerateBrandedAssetOutputSchema>;

export async function generateBrandedAsset(input: GenerateBrandedAssetInput): Promise<GenerateBrandedAssetOutput> {
  return generateBrandedAssetFlow(input);
}

const emojiMap: Record<string, string> = {
    Food: '🍔🍕🍰',
    Fitness: '💪🏋️‍♀️🧘‍♂️',
    Tech: '💻📱🚀',
    Fashion: '👗👠👜',
    Retail: '🛍️🛒🎁',
    'Real Estate': '🏠🔑🏗️',
    Consulting: '📈🤝📊',
    Creative: '🎨🎬🎤',
    Other: '✨🌟💡',
  };

const promptTemplate = `
You are a professional and creative graphic designer creating a stunningly beautiful branded asset.

**Asset Type:** {{{assetType}}}
**Business Type:** {{{businessType}}}
**Color Palette:** {{#each colorPalette}}{{{this}}} {{/each}}
**Font Style:** {{{fontStyle}}}
**Brand Tone:** {{{brandTone}}}
**Relevant Emojis:** {{{emojis}}}

{{#if brandName}}**Brand Name:** {{{brandName}}}{{/if}}
{{#if phone}}**Phone:** {{{phone}}}{{/if}}
{{#if email}}**Email:** {{{email}}}{{/if}}

Instructions:
1.  Create a visually appealing and professional {{{assetType}}} design based on the provided brand guidelines.
2.  The design must be clean, modern, and perfectly suited for the specified business type.
3.  Use the color palette effectively and creatively. The primary color should be prominent.
4.  Incorporate the provided emojis subtly and artistically into the design. They should enhance the theme, not look like a text message.
5.  Ensure all text is legible and stylish, using a font that matches the specified font style.
6.  For a business card, include the brand name, phone number, and email in a creative and professional layout. Use placeholder text ONLY if these details are not provided.
7.  For social media posts, use engaging imagery and layouts. If a brand name is provided, incorporate it naturally.
8.  The final output should be a high-quality, eye-catching image.
`;

const generateBrandedAssetFlow = ai.defineFlow(
  {
    name: 'generateBrandedAssetFlow',
    inputSchema: GenerateBrandedAssetInputSchema,
    outputSchema: GenerateBrandedAssetOutputSchema,
  },
  async (input) => {
    const emojis = emojiMap[input.businessType] || emojiMap['Other'];
    const template = Handlebars.compile(promptTemplate);
    const finalPrompt = template({...input, emojis});
    
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: finalPrompt,
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
