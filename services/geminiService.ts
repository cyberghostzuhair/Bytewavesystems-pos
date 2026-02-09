
// Fix: Use the standard import and add Type for schema configuration
import { GoogleGenAI, Type } from "@google/genai";

// Fix: Initialize GoogleGenAI correctly with the environment variable
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getBusinessInsight(orderHistory: any[], inventory: any[]) {
  const prompt = `
    Analyze the following business data for a retail shop:
    Orders: ${JSON.stringify(orderHistory)}
    Inventory: ${JSON.stringify(inventory)}
    
    Provide 3 concise, actionable insights for the business owner. Focus on sales trends or inventory warnings.
  `;

  try {
    // Fix: Used the recommended model and responseSchema for more reliable results
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
      }
    });

    // Fix: Safely access the text property and parse the JSON response
    const text = response.text;
    if (text) {
      return JSON.parse(text.trim());
    }
    return ["No insights available at this time."];
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return ["Smart analysis is currently unavailable. Check your internet connection."];
  }
}
