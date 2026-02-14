
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const checkFoodCompatibility = async (food1: string, food2: string) => {
  const prompt = `Assess the compatibility of ${food1} and ${food2} based on Ayurvedic principles (Viruddha Ahara). 
  Return a JSON object indicating if they are compatible and a short explanation.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isCompatible: { type: Type.BOOLEAN },
          explanation: { type: Type.STRING },
          severity: { type: Type.STRING, description: "Safe, Caution, or Warning" }
        },
        required: ["isCompatible", "explanation", "severity"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const getAIPantryMeals = async (pantry: string[], dosha: string) => {
  const prompt = `Based on these pantry items: ${pantry.join(', ')}, suggest 3 ${dosha}-balancing Ayurvedic meals. 
  Include prep time and basic nutritional estimation.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            time: { type: Type.STRING },
            dosha: { type: Type.STRING }
          },
          required: ["name", "description", "time", "dosha"]
        }
      }
    }
  });

  return JSON.parse(response.text);
};
