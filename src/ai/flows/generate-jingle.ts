'use server';
/**
 * @fileOverview Generates an audio jingle for a brand.
 *
 * - generateJingle - A function that generates a jingle.
 * - GenerateJingleInput - The input type for the generateJingle function.
 * - GenerateJingleOutput - The return type for the generateJingle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';
import {googleAI} from '@genkit-ai/googleai';

const GenerateJingleInputSchema = z.object({
  brandName: z.string().describe('The name of the brand or company.'),
  businessType: z.string().describe('The type of business (e.g., Food, Fitness).'),
});
export type GenerateJingleInput = z.infer<typeof GenerateJingleInputSchema>;

const GenerateJingleOutputSchema = z.object({
  jingleUrl: z.string().describe('The generated audio jingle as a data URI.'),
  jingleScript: z.string().describe('The script used for the jingle.'),
});
export type GenerateJingleOutput = z.infer<typeof GenerateJingleOutputSchema>;

export async function generateJingle(input: GenerateJingleInput): Promise<GenerateJingleOutput> {
  return generateJingleFlow(input);
}

const jingleScriptPrompt = ai.definePrompt({
  name: 'jingleScriptPrompt',
  input: {schema: GenerateJingleInputSchema},
  output: {schema: z.object({script: z.string().describe('A short, catchy, memorable jingle script under 20 words.')})},
  prompt: `You are a creative jingle writer. Write a short, catchy, and memorable advertising jingle script for the following brand. The jingle should be upbeat and positive. The script must be less than 20 words.

Brand Name: {{{brandName}}}
Business Type: {{{businessType}}}

Example for a coffee shop named "WakeUp": "Need a lift? A better day? Get your WakeUp coffee, right away!"

Generate a script for the provided brand.`,
});

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => bufs.push(d));
    writer.on('end', () => resolve(Buffer.concat(bufs).toString('base64')));

    writer.write(pcmData);
    writer.end();
  });
}

const generateJingleFlow = ai.defineFlow(
  {
    name: 'generateJingleFlow',
    inputSchema: GenerateJingleInputSchema,
    outputSchema: GenerateJingleOutputSchema,
  },
  async (input) => {
    // 1. Generate the jingle script
    const {output} = await jingleScriptPrompt(input);
    if (!output?.script) {
        throw new Error('Failed to generate jingle script.');
    }
    const jingleScript = output.script;
    
    // 2. Convert the script to audio
    const {media} = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {voiceName: 'Algenib'}, // A friendly, upbeat voice
          },
        },
      },
      prompt: jingleScript,
    });
    
    if (!media) {
      throw new Error('Text-to-speech generation failed to return media.');
    }

    // 3. Convert PCM audio to WAV format
    const audioBuffer = Buffer.from(media.url.substring(media.url.indexOf(',') + 1), 'base64');
    const wavBase64 = await toWav(audioBuffer);
    const jingleUrl = 'data:audio/wav;base64,' + wavBase64;

    return { jingleUrl, jingleScript };
  }
);
