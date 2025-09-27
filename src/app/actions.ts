'use server';

import { voiceSosWithLocationFormatting } from '@/ai/flows/voice-sos-location-formatter';
import type { VoiceSosInput, VoiceSosOutput } from '@/ai/flows/voice-sos-location-formatter';

export async function getSosMessage(input: VoiceSosInput): Promise<VoiceSosOutput> {
  try {
    const result = await voiceSosWithLocationFormatting(input);
    return result;
  } catch (error) {
    console.error('Error in getSosMessage action:', error);
    // Return a fallback message in case of AI error
    return {
      message: `Emergency! I need help. My location is https://www.google.com/maps?q=${input.latitude},${input.longitude}`
    };
  }
}
