
// The `use server` directive is necessary to inform the Next.js runtime that this code should only be executed on the server.
'use server';
/**
 * @fileOverview Extracts brand information (color palette, font style, and tone) from a logo image and business type.
 *
 * - extractBrandFromLogo - A function that extracts brand information from a logo.
 * - ExtractBrandFromLogoInput - The input type for the extractBrandFromLogo function.
 * - ExtractBrandFromLogoOutput - The return type for the extractBrandFromLogo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractBrandFromLogoInputSchema = z.object({
  logoDataUri: z
    .string()
    .describe(
      "A logo image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  businessType: z.string().describe('The type of business (e.g., Food, Fitness).'),
});
export type ExtractBrandFromLogoInput = z.infer<typeof ExtractBrandFromLogoInputSchema>;

const ExtractBrandFromLogoOutputSchema = z.object({
  colorPalette: z.array(z.string().regex(/^#[0-9a-fA-F]{6}$/, "Color must be a valid hex code.")).describe('The color palette extracted from the logo as an array of hex codes.'),
  fontStyle: z.string().describe('The font style that best matches the brand.'),
  brandTone: z.string().describe('The overall brand tone (e.g., modern, playful, minimal).'),
});
export type ExtractBrandFromLogoOutput = z.infer<typeof ExtractBrandFromLogoOutputSchema>;

export async function extractBrandFromLogo(input: ExtractBrandFromLogoInput): Promise<ExtractBrandFromLogoOutput> {
  return extractBrandFromLogoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractBrandFromLogoPrompt',
  input: {schema: ExtractBrandFromLogoInputSchema},
  output: {schema: ExtractBrandFromLogoOutputSchema},
  prompt: `You are an expert branding consultant and designer. Your task is to extract a visually appealing and cohesive brand identity from the provided logo image and business type.

  Logo: {{media url=logoDataUri}}
  Business Type: {{{businessType}}}

  **Instructions:**
  1.  **Color Palette:** Extract a palette of 5-10 colors from the logo. The first color should be the most dominant and suitable as a primary brand color. The colors should be aesthetically pleasing and work well together. Output each color as a valid 6-digit hex code (e.g., "#RRGGBB").
  2.  **Font Style:** Based on the logo's design and the business type, choose a single, most appropriate font style from the following options: \`sans-serif\`, \`serif\`, \`display\`, \`handwriting\`, \`monospace\`.
  3.  **Brand Tone:** Based on the logo and business type, determine the most fitting brand tone from the following options: \`modern\`, \`playful\`, \`minimal\`, \`elegant\`, \`corporate\`.

  Ensure that the final output strictly adheres to the specified JSON output schema, including the correct data types and constraints.`, 
});

const extractBrandFromLogoFlow = ai.defineFlow(
  {
    name: 'extractBrandFromLogoFlow',
    inputSchema: ExtractBrandFromLogoInputSchema,
    outputSchema: ExtractBrandFromLogoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
