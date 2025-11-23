'use server';

import { symptomChecker } from "@/ai/flows/symptom-checker-ai";
import { getFirstAidGuidance } from "@/ai/flows/first-aid-guidance";
import type { SymptomCheckerOutput } from "@/ai/flows/symptom-checker-ai";
import type { FirstAidGuidanceOutput } from "@/ai/flows/first-aid-guidance";

type SymptomResult = SymptomCheckerOutput | { error: string };
type FirstAidResult = FirstAidGuidanceOutput | { error: string };

export async function handleSymptomCheck(symptoms: string, language: string): Promise<SymptomResult> {
  try {
    const result = await symptomChecker({ symptoms, language });
    return result;
  } catch (error) {
    console.error("Error in symptom checker AI:", error);
    return { error: "Sorry, I couldn't process your request. Please try again." };
  }
}

export async function handleFirstAid(condition: string, symptoms: string, language: string): Promise<FirstAidResult> {
  try {
    const result = await getFirstAidGuidance({ condition, symptoms, language });
    return result;
  } catch (error) {
    console.error("Error in first aid AI:", error);
    return { error: "Sorry, I couldn't find first aid guidance for this condition." };
  }
}
