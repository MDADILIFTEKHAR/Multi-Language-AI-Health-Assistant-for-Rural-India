'use server';

/**
 * @fileOverview An AI agent that asks symptom-based questions and detects possible health conditions.
 *
 * - symptomChecker - A function that handles the symptom checking process.
 * - SymptomCheckerInput - The input type for the symptomChecker function.
 * - SymptomCheckerOutput - The return type for the symptomChecker function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SymptomCheckerInputSchema = z.object({
  language: z
    .string()
    .describe("The user's language."),
  symptoms: z
    .string()
    .describe('The symptoms described by the user.'),
  medicalHistory: z
    .string()
    .optional()
    .describe('The user medical history, if available'),
});
export type SymptomCheckerInput = z.infer<typeof SymptomCheckerInputSchema>;

const SymptomCheckerOutputSchema = z.object({
  detectedCondition: z
    .string()
    .describe('Possible health conditions detected by the AI.'),
  followUpQuestions: z
    .string()
    .describe('Relevant follow-up questions to ask the user.'),
});
export type SymptomCheckerOutput = z.infer<typeof SymptomCheckerOutputSchema>;

export async function symptomChecker(input: SymptomCheckerInput): Promise<SymptomCheckerOutput> {
  return symptomCheckerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'symptomCheckerPrompt',
  input: {schema: SymptomCheckerInputSchema},
  output: {schema: SymptomCheckerOutputSchema},
  prompt: `You are an AI medical assistant that helps users understand their symptoms and possible health conditions.

You will ask simple symptom-based questions to understand the user's condition better.
You will then detect possible conditions (non-diagnostic) based on the symptoms and medical history (if available).
Respond in the same language as the user.

Language: {{{language}}}
Symptoms: {{{symptoms}}}
Medical History: {{{medicalHistory}}}

Follow-up Questions: 
Detected Condition: `,
});

const symptomCheckerFlow = ai.defineFlow(
  {
    name: 'symptomCheckerFlow',
    inputSchema: SymptomCheckerInputSchema,
    outputSchema: SymptomCheckerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
