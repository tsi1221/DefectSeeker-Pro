
import { GoogleGenAI, Type } from "@google/genai";
import { DefectSeverity } from "../types";

export interface PredictionResult {
  severity: DefectSeverity;
  reasoning: string;
}

export const predictSeverity = async (title: string, description: string, category: string): Promise<PredictionResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this software defect and predict its severity.
      Title: ${title}
      Description: ${description}
      Category: ${category}
      
      Return a JSON object with 'severity' (Low, Medium, High, Critical) and 'reasoning' (max 2 sentences).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            severity: {
              type: Type.STRING,
              description: 'The predicted severity level.',
              enum: ['Low', 'Medium', 'High', 'Critical']
            },
            reasoning: {
              type: Type.STRING,
              description: 'Short explanation for the prediction.'
            }
          },
          required: ['severity', 'reasoning']
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return {
      severity: result.severity as DefectSeverity,
      reasoning: result.reasoning || "Predicted by AI model."
    };
  } catch (error) {
    console.error("AI Prediction failed", error);
    // Fallback logic
    return {
      severity: DefectSeverity.MEDIUM,
      reasoning: "AI prediction unavailable. Defaulted to Medium."
    };
  }
};
