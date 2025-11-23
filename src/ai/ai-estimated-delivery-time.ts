'use server';

/**
 * @fileOverview This file defines a Genkit flow to estimate delivery time based on customer and shop locations.
 *
 * - estimateDeliveryTime - A function that estimates the delivery time.
 * - EstimatedDeliveryTimeInput - The input type for the estimateDeliveryTime function.
 * - EstimatedDeliveryTimeOutput - The return type for the estimateDeliveryTime function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const EstimatedDeliveryTimeInputSchema = z.object({
  customerLocation: z
    .string()
    .describe('The current location of the customer. This can be an address or GPS coordinates.'),
  shopLocation: z
    .string()
    .describe('The location of the shop.  This can be an address or GPS coordinates.'),
  orderTotal: z
    .number()
    .describe('The total value of the order, in the local currency.  This can be used to prioritize larger orders.'),
  timeOfDay: z
    .string()
    .describe('The time of day the order is being placed. e.g. 3:00 PM.  This will affect traffic conditions.'),
});
export type EstimatedDeliveryTimeInput = z.infer<typeof EstimatedDeliveryTimeInputSchema>;

const EstimatedDeliveryTimeOutputSchema = z.object({
  estimatedTime: z
    .string()
    .describe(
      'The estimated delivery time in minutes. Consider traffic, distance, and order size.'
    ),
  confidence: z
    .number()
    .describe('A value between 0 and 1 indicating the confidence in the estimate.'),
});
export type EstimatedDeliveryTimeOutput = z.infer<typeof EstimatedDeliveryTimeOutputSchema>;

export async function estimateDeliveryTime(
  input: EstimatedDeliveryTimeInput
): Promise<EstimatedDeliveryTimeOutput> {
  return estimateDeliveryTimeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'estimateDeliveryTimePrompt',
  input: { schema: EstimatedDeliveryTimeInputSchema },
  output: { schema: EstimatedDeliveryTimeOutputSchema },
  prompt: `You are a delivery time estimator.

You are provided with the customer location, shop location, the total value of the order, and the time of day.

Using this information, estimate the delivery time in minutes.

Consider traffic, distance, and order size when estimating the delivery time.  You must output a confidence score between 0 and 1 indicating your certainty of the estimate.

Customer Location: {{{customerLocation}}}
Shop Location: {{{shopLocation}}}
Order Total: {{{orderTotal}}}
Time of Day: {{{timeOfDay}}}`,
});

const estimateDeliveryTimeFlow = ai.defineFlow(
  {
    name: 'estimateDeliveryTimeFlow',
    inputSchema: EstimatedDeliveryTimeInputSchema,
    outputSchema: EstimatedDeliveryTimeOutputSchema,
  },
  async (input: EstimatedDeliveryTimeInput) => {
    const { output } = await prompt(input);
    return output!;
  }
);
