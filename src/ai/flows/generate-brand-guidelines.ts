'use server';
/**
 * @fileOverview Generates a complete brand guidelines HTML document.
 *
 * - generateBrandGuidelines - A function that handles the brand guidelines generation.
 * - GenerateBrandGuidelinesInput - The input type for the generateBrandGuidelines function.
 * - GenerateBrandGuidelinesOutput - The return type for the generateBrandGuidelines function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BrandInfoSchema = z.object({
  colorPalette: z.array(z.string()).describe('The color palette extracted from the logo.'),
  fontStyle: z.string().describe('The font style that best matches the brand.'),
  brandTone: z.string().describe('The overall brand tone (e.g., modern, playful, minimal).'),
});


export const GenerateBrandGuidelinesInputSchema = z.object({
  brandInfo: BrandInfoSchema,
  logoDataUri: z
    .string()
    .describe(
      "The brand logo image, as a data URI that must include a MIME type and use Base64 encoding."
    ),
  businessType: z.string().describe('The type of business (e.g., Food, Fitness).'),
});
export type GenerateBrandGuidelinesInput = z.infer<typeof GenerateBrandGuidelinesInputSchema>;

export const GenerateBrandGuidelinesOutputSchema = z.object({
  guidelinesHtml: z.string().describe('The generated brand guidelines as an HTML string.'),
});
export type GenerateBrandGuidelinesOutput = z.infer<typeof GenerateBrandGuidelinesOutputSchema>;


export async function generateBrandGuidelines(input: GenerateBrandGuidelinesInput): Promise<GenerateBrandGuidelinesOutput> {
  return generateBrandGuidelinesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBrandGuidelinesPrompt',
  input: {schema: GenerateBrandGuidelinesInputSchema},
  output: {schema: GenerateBrandGuidelinesOutputSchema},
  prompt: `
You are a professional brand strategist and designer. Your task is to generate a comprehensive and visually appealing brand guidelines document in HTML format based on the provided brand information.

**Brand Information:**
- **Logo:** {{media url=logoDataUri}}
- **Color Palette:** {{brandInfo.colorPalette}}
- **Typography Style:** {{brandInfo.fontStyle}}
- **Brand Tone:** {{brandInfo.brandTone}}
- **Business Type:** {{businessType}}

**Instructions:**
1.  Create a single, self-contained HTML file. Use inline CSS for all styling. Do not use external or <style> tags.
2.  The design should be modern, clean, and professional.
3.  The document should be well-structured with clear headings for each section (Logo, Color Palette, Typography, Brand Tone).
4.  **Logo Section:** Display the provided logo image prominently. The logo should be embedded using the data URI. Add a brief guideline on its usage (e.g., "Maintain clear space around the logo.").
5.  **Color Palette Section:** Display each color from the palette as a colored swatch. Below each swatch, list its HEX code.
6.  **Typography Section:** Recommend a specific, free-to-use Google Font that matches the brand's font style (e.g., if the style is 'sans-serif', recommend 'Inter' or 'Poppins'). Provide a headline and body text example using this font.
7.  **Brand Tone Section:** Describe the brand tone and provide examples of how to apply it in communication.
8.  The overall HTML structure should be semantic and well-organized. Use divs, h1, h2, p, etc.
9.  The final output must be a single string containing the full HTML code.
`,
});


const generateBrandGuidelinesFlow = ai.defineFlow(
  {
    name: 'generateBrandGuidelinesFlow',
    inputSchema: GenerateBrandGuidelinesInputSchema,
    outputSchema: GenerateBrandGuidelinesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
