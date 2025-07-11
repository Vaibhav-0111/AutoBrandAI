import { config } from 'dotenv';
config();

import '@/ai/flows/auto-apply-brand-to-template.ts';
import '@/ai/flows/extract-brand-from-logo.ts';
import '@/ai/flows/generate-social-media-headers.ts';
import '@/ai/flows/generate-branded-asset.ts';
