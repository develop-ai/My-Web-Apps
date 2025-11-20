import { GoogleGenAI, Type } from "@google/genai";
import { AIResponse } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const solveWithGemini = async (prompt: string): Promise<AIResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are an advanced mathematical assistant. 
        Your goal is to solve the user's math problem, whether it is a simple arithmetic expression, a word problem, or a complex equation.
        Always prioritize accuracy. Provide the final result and a brief, clear explanation of how you arrived at it.
        If the input is not a math problem, politely ask for a math problem in the explanation and set result to "Error".
        `,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            result: {
              type: Type.STRING,
              description: "The final numerical or algebraic answer. Keep it concise.",
            },
            explanation: {
              type: Type.STRING,
              description: "A step-by-step explanation of the solution, max 2-3 sentences.",
            }
          },
          required: ["result", "explanation"],
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as AIResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      result: "Error",
      explanation: "Failed to connect to AI service. Please check your connection or API key."
    };
  }
};