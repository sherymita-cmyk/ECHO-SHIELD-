'use server';

/**
 * @fileOverview A flow to determine the best message content for SOS alerts.
 *
 * - selectMessageContent - A function that selects the message content for SOS alerts.
 * - MessageContentSelectorInput - The input type for the selectMessageContent function.
 * - MessageContentSelectorOutput - The return type for the selectMessageContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MessageContentSelectorInputSchema = z.object({
  isMoving: z.boolean().describe('Whether the user is currently moving.'),
  timeOfDay: z.string().describe('The current time of day (e.g., morning, afternoon, evening, night).'),
  location: z.string().describe('Current location of the user.'),
});
export type MessageContentSelectorInput = z.infer<typeof MessageContentSelectorInputSchema>;

const MessageContentSelectorOutputSchema = z.object({
  messageContent: z.string().describe('The selected message content for the SOS alert.'),
});
export type MessageContentSelectorOutput = z.infer<typeof MessageContentSelectorOutputSchema>;

export async function selectMessageContent(input: MessageContentSelectorInput): Promise<MessageContentSelectorOutput> {
  return messageContentSelectorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'messageContentSelectorPrompt',
  input: {schema: MessageContentSelectorInputSchema},
  output: {schema: MessageContentSelectorOutputSchema},
  prompt: `You are an AI assistant that helps select the best message content for an SOS alert.

Consider the following contextual information:
- Is the user moving: {{isMoving}}
- Time of day: {{timeOfDay}}
- Current location: {{location}}

Based on this information, select the most appropriate message content from the following options:

1. "SOS! I need help. My current location is: {{location}}"
2. "I'm in danger and need assistance. I'm currently at: {{location}}"
3. "Emergency! Please send help to my location: {{location}}"

If the user is moving, emphasize the need for immediate assistance. If it's night, also indicate the urgency.

Return the selected message content.`,
});

const messageContentSelectorFlow = ai.defineFlow(
  {
    name: 'messageContentSelectorFlow',
    inputSchema: MessageContentSelectorInputSchema,
    outputSchema: MessageContentSelectorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
