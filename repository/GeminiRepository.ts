
import { GoogleGenAI, Type } from "@google/genai";
import { Movie, NewsItem, SportsEvent } from "../types";

export class GeminiService {
  private getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async getAiRecommendations(prompt: string): Promise<Movie[]> {
    try {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Act as a movie recommendation engine for a streaming app called "Unique TV". 
                  Based on the following request: "${prompt}", generate 6 unique movie or TV show recommendations.
                  Each recommendation must include a catchy title, a detailed and intriguing description, a category, rating (0.0 to 10.0), duration, and year.
                  Return the result ONLY as a JSON array.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                category: { type: Type.STRING },
                rating: { type: Type.NUMBER },
                duration: { type: Type.STRING },
                year: { type: Type.INTEGER },
              },
              required: ["title", "description", "category", "rating", "duration", "year"]
            }
          }
        }
      });

      const jsonStr = response.text.trim();
      const rawMovies = JSON.parse(jsonStr);
      
      return rawMovies.map((m: any, idx: number) => ({
        ...m,
        id: m.id || `ai-${idx}-${Date.now()}`,
        thumbnail: `https://picsum.photos/seed/${encodeURIComponent(m.title)}/800/450`
      }));
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }

  async generateTrailer(movieTitle: string): Promise<string> {
    const ai = this.getAI();
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `A cinematic trailer sequence for a movie titled "${movieTitle}". Epic shots, dramatic camera movements, 1080p.`,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }

  async getLatestMovieNews(): Promise<NewsItem[]> {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "What are the latest big news in the global movie and streaming industry today?",
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return chunks.map((chunk: any) => ({
      title: chunk.web?.title || "Industry Update",
      snippet: response.text?.substring(0, 150) + "...",
      url: chunk.web?.uri || "#",
      source: new URL(chunk.web?.uri || "https://unique.tv").hostname
    })).filter((item: any) => item.url !== "#").slice(0, 5);
  }

  async getSportsUpdates(): Promise<SportsEvent[]> {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "What are the top 5 live major sports events today? Return JSON array.",
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              status: { type: Type.STRING },
              score: { type: Type.STRING },
              time: { type: Type.STRING },
              league: { type: Type.STRING }
            },
            required: ["title", "status", "time", "league"]
          }
        }
      },
    });
    return JSON.parse(response.text.trim());
  }
}

export const gemini = new GeminiService();
