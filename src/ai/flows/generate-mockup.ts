'use server';
/**
 * @fileOverview Generates a mockup image for a given branded asset.
 *
 * - generateMockup - A function that handles the mockup generation.
 * - GenerateMockupInput - The input type for the generateMockup function.
 * - GenerateMockupOutput - The return type for the generateMockup function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMockupInputSchema = z.object({
  assetDataUri: z
    .string()
    .describe(
      "The branded asset image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  assetType: z.string().describe('The type of asset to generate a mockup for (e.g., Business Card, Instagram Post).'),
  businessType: z.string().describe('The type of business (e.g., Food, Fitness).'),
});
export type GenerateMockupInput = z.infer<typeof GenerateMockupInputSchema>;

const GenerateMockupOutputSchema = z.object({
  mockupDataUri: z.string().describe('The generated mockup as a data URI.'),
});
export type GenerateMockupOutput = z.infer<typeof GenerateMockupOutputSchema>;

export async function generateMockup(input: GenerateMockupInput): Promise<GenerateMockupOutput> {
  return generateMockupFlow(input);
}

const promptTemplates: Record<string, string> = {
    'Business Card': `
      A photorealistic mockup of a business card. The card is placed on a stylish, modern desk that matches the theme of a '{{{businessType}}}' business. The desk has relevant items like a laptop, a cup of coffee, and a plant. The lighting is professional and highlights the business card.
    `,
    'Instagram Post': `
      A photorealistic mockup of a person holding a smartphone. The phone screen displays the provided social media post. The person and background should fit the theme of a '{{{businessType}}}' business (e.g., a person in activewear for a 'Fitness' business). The image is clean, bright, and engaging.
    `,
    'Business Flyer': `
      A photorealistic mockup of the provided flyer. The flyer is tacked to a wall or bulletin board in a location relevant to a '{{{businessType}}}' business (e.g., a community board in a cafe for a 'Food' business). The environment should look natural and professional.
    `,
    'Instagram Story': `
      A photorealistic mockup of a person holding a smartphone, clearly showing the Instagram story on the screen. The person's hand and the background environment are stylish and fit the vibe of a '{{{businessType}}}' business. The focus is on the phone screen.
    `,
    'Default': `
      A photorealistic mockup of the provided image. The image is displayed in a clean, modern, and professional setting that is relevant to a '{{{businessType}}}' business. The lighting is soft and the composition is aesthetically pleasing.
    `
};

const generateMockupFlow = ai.defineFlow(
  {
    name: 'generateMockupFlow',
    inputSchema: GenerateMockupInputSchema,
    outputSchema: GenerateMockupOutputSchema,
  },
  async (input) => {
    const promptTemplate = (promptTemplates[input.assetType] || promptTemplates['Default']).replace('{{{businessType}}}', input.businessType);

    const prompt = [
        {text: promptTemplate},
        {media: {url: input.assetDataUri}},
    ];

    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media.url) {
        throw new Error('Mockup generation failed to return a data URI.');
    }

    return { mockupDataUri: media.url };
  }
);
