'use server';

/**
 * @fileOverview A flow to handle voice-activated SOS with location formatting.
 *
 * - voiceSosWithLocationFormatting - A function that triggers an SOS via voice command and sends messages with location.
 * - VoiceSosInput - The input type for the voiceSosWithLocationFormatting function.
 * - VoiceSosOutput - The return type for the voiceSosWithLocationFormatting function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VoiceSosInputSchema = z.object({
  latitude: z.number().describe('The latitude of the user.'),
  longitude: z.number().describe('The longitude of the user.'),
  emergencyContacts: z.array(z.string()).describe('List of emergency contact phone numbers.'),
});
export type VoiceSosInput = z.infer<typeof VoiceSosInputSchema>;

const VoiceSosOutputSchema = z.object({
  message: z.string().describe('The message sent to emergency contacts.'),
});
export type VoiceSosOutput = z.infer<typeof VoiceSosOutputSchema>;

export async function voiceSosWithLocationFormatting(input: VoiceSosInput): Promise<VoiceSosOutput> {
  return voiceSosFlow(input);
}

const prompt = ai.definePrompt({
  name: 'voiceSosPrompt',
  input: {schema: VoiceSosInputSchema},
  output: {schema: VoiceSosOutputSchema},
  prompt: `You are an AI assistant that helps users send SOS messages to their emergency contacts.

The user has triggered an SOS and their current location is:
Latitude: {{{latitude}}}
Longitude: {{{longitude}}}

Emergency Contacts: {{{emergencyContacts}}}

Decide whether to include the location as raw coordinates or format it as a URL for easy viewing on a map.
Create a concise message to be sent via SMS and WhatsApp to the emergency contacts that includes the location. If you include URL to display location, make sure to use https URL. If you don't know what URL to use, use Google Maps URL (https://www.google.com/maps/place/{{{latitude}}},{{{longitude}}}). Make the message as short as possible.
`,
});

const voiceSosFlow = ai.defineFlow(
  {
    name: 'voiceSosFlow',
    inputSchema: VoiceSosInputSchema,
    outputSchema: VoiceSosOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
