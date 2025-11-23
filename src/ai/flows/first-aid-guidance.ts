'use server';

/**
 * @fileOverview A flow that fetches and tailors first-aid advice based on detected symptoms.
 *
 * - getFirstAidGuidance - A function that retrieves and customizes first-aid advice.
 * - FirstAidGuidanceInput - The input type for the getFirstAidGuidance function.
 * - FirstAidGuidanceOutput - The return type for the getFirstAidGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {getFirestore} from 'firebase-admin/firestore';

const FirstAidGuidanceInputSchema = z.object({
  condition: z.string().describe('The detected health condition.'),
  symptoms: z.string().describe('The symptoms experienced by the user.'),
  language: z.string().describe('The language in which to provide the guidance.'),
});
export type FirstAidGuidanceInput = z.infer<typeof FirstAidGuidanceInputSchema>;

const FirstAidGuidanceOutputSchema = z.object({
  advice: z.string().describe('Tailored first-aid advice for the condition, including do\u2019s and don\u2019ts.'),
});
export type FirstAidGuidanceOutput = z.infer<typeof FirstAidGuidanceOutputSchema>;

export async function getFirstAidGuidance(input: FirstAidGuidanceInput): Promise<FirstAidGuidanceOutput> {
  return firstAidGuidanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'firstAidGuidancePrompt',
  input: {schema: FirstAidGuidanceInputSchema},
  output: {schema: FirstAidGuidanceOutputSchema},
  prompt: `You are an AI assistant providing first-aid guidance in {{{language}}}.  A user is experiencing the following symptoms: {{{symptoms}}}.  Based on these symptoms, the AI has suggested the following possible condition: {{{condition}}}.

  Provide tailored first-aid advice, including specific do's and don'ts.  Also, suggest when it is important to seek professional medical help.  Fetch the first aid information from the document using the condition title.

  Respond in {{{language}}}.`,
});

const firstAidGuidanceFlow = ai.defineFlow(
  {
    name: 'firstAidGuidanceFlow',
    inputSchema: FirstAidGuidanceInputSchema,
    outputSchema: FirstAidGuidanceOutputSchema,
  },
  async input => {
    const db = getFirestore();
    const conditionDoc = await db.collection('first_aid_help').where('title', '==', input.condition).get();

    if (conditionDoc.empty) {
      console.log('No matching documents.');
      return {advice: 'No first aid guidance found for this condition.'};
    }

    let conditionData = null;
    conditionDoc.forEach(doc => {
      conditionData = doc.data();
    });

    if (!conditionData) {
      return {advice: 'No first aid guidance found for this condition.'};
    }

    const promptInput = {
      ...input,
      condition: conditionData.title,
      symptoms: conditionData.symptoms,
    };

    const {output} = await prompt(promptInput);
    return output!;
  }
);
