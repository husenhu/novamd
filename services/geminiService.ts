
import { GoogleGenAI } from "@google/genai";
import { AIAction } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export const processTextWithAI = async (text: string, action: AIAction): Promise<string> => {
  if (!text.trim()) return "Please provide some text to process.";

  const promptMap: Record<AIAction, string> = {
    'polish': "Please proofread and polish the following Markdown text. Focus on fixing grammar, improving sentence flow, and making the language more elegant while strictly preserving all Markdown formatting and the original meaning.",
    'summarize': "Create a high-level executive summary of the following Markdown content. Organize it with clear headings and bullet points for readability. Highlight ONLY the most important key takeaways.",
    'expand': "Deeply elaborate on the concepts mentioned in the following Markdown content. Add relevant details, examples, and context to turn the brief points into comprehensive explanations. Maintain the existing Markdown style.",
    'tone-professional': "Transform the following text into a formal, authoritative, and sophisticated professional document. Use industry-standard terminology, avoid contractions, and ensure the tone is objective and business-ready.",
    'tone-creative': "Infuse the following text with vivid imagery, engaging metaphors, and a dynamic narrative voice. Rewrite it to be storytelling-oriented, captivating, and emotionally resonant while keeping the core message."
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${promptMap[action]}\n\nContent:\n${text}`
    });

    return response.text || "AI could not generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `Error: ${error instanceof Error ? error.message : 'Failed to connect to Gemini AI'}`;
  }
};
