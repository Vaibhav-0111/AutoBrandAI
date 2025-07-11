'use server';
/**
 * @fileOverview Applies extracted brand elements (colors, fonts, tone) to pre-selected Adobe Express templates.
 *
 * - autoApplyBrandToTemplate - A function that handles the application of brand elements to templates.
 * - AutoApplyBrandToTemplateInput - The input type for the autoApplyBrandToTemplate function.
 * - AutoApplyBrandToTemplateOutput - The return type for the autoApplyBrandToTemplate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutoApplyBrandToTemplateInputSchema = z.object({
  templateId: z.string().describe('The ID of the Adobe Express template to customize.'),
  colorPalette: z.array(z.string()).describe('An array of color hex codes representing the brand color palette.'),
  fontStyle: z.string().describe('The name of the font style to apply to the template.'),
  brandTone: z.string().describe('A description of the brand tone (e.g., modern, playful, minimal).'),
});
export type AutoApplyBrandToTemplateInput = z.infer<typeof AutoApplyBrandToTemplateInputSchema>;

const AutoApplyBrandToTemplateOutputSchema = z.object({
  customizedTemplateUrl: z.string().describe('URL of the customized template with the applied brand elements.'),
});
export type AutoApplyBrandToTemplateOutput = z.infer<typeof AutoApplyBrandToTemplateOutputSchema>;

export async function autoApplyBrandToTemplate(input: AutoApplyBrandToTemplateInput): Promise<AutoApplyBrandToTemplateOutput> {
  return autoApplyBrandToTemplateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'autoApplyBrandToTemplatePrompt',
  input: {schema: AutoApplyBrandToTemplateInputSchema},
  output: {schema: AutoApplyBrandToTemplateOutputSchema},
  prompt: `You are an expert in applying brand guidelines to design templates.

You will receive a template ID, a color palette, a font style, and a brand tone.
Your goal is to generate a URL for the customized template with the provided brand elements applied.

Template ID: {{{templateId}}}
Color Palette: {{{colorPalette}}}
Font Style: {{{fontStyle}}}
Brand Tone: {{{brandTone}}}

Based on the above information, return the URL of the customized template.
`,
});

const autoApplyBrandToTemplateFlow = ai.defineFlow(
  {
    name: 'autoApplyBrandToTemplateFlow',
    inputSchema: AutoApplyBrandToTemplateInputSchema,
    outputSchema: AutoApplyBrandToTemplateOutputSchema,
  },
  async input => {
    // Here, you would integrate with the Adobe Express APIs to apply the design system.
    // This is a placeholder for the actual API integration.
    // In a real implementation, you would use the templateId to fetch the template,
    // then apply the colorPalette, fontStyle, and brandTone using the Adobe Express APIs.
    // Finally, you would return the URL of the customized template.

    // For now, we'll just return a dummy URL.
    const customizedTemplateUrl = `https://example.com/template/${input.templateId}?color=${input.colorPalette[0]}&font=${input.fontStyle}&tone=${input.brandTone}`;

    return {customizedTemplateUrl};
  }
);
