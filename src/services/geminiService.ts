import { GoogleGenAI, Type } from "@google/genai";
import { CalendarEvent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function parseSchedulingPrompt(prompt: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      systemInstruction: "You are the Ultimate AI Calendar assistant. Parse natural language scheduling requests. Return a JSON object with title, start_time, duration_minutes, priority (1-10), type (meeting, task, deep_work, admin, travel), and persona (work, family, side). Use ISO 8601 for dates.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          start_time: { type: Type.STRING },
          duration_minutes: { type: Type.NUMBER },
          priority: { type: Type.NUMBER },
          type: { type: Type.STRING },
          persona: { type: Type.STRING },
          action_items: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["title", "start_time", "duration_minutes", "priority", "type", "persona"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
}

export async function resolveConflicts(events: CalendarEvent[], newEvent: CalendarEvent) {
  const prompt = `Given these existing events: ${JSON.stringify(events)} and this new event: ${JSON.stringify(newEvent)}, identify conflicts and propose a resolution (reschedule lower priority, or stick with new event).`;
  
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      systemInstruction: "You are a genius scheduler. Resolve conflicts by prioritizing higher priority scores and deep work windows.",
      responseMimeType: "application/json",
    },
  });

  return JSON.parse(response.text || "{}");
}
