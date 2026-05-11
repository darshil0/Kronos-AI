import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function parseSchedulingPrompt(prompt: string, currentTime: string = new Date().toISOString()) {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Current Time: ${currentTime}\nPrompt: ${prompt}`,
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

export async function resolveConflicts(existingEvents: any[], newEvent: any) {
  const prompt = `
    EXISTING EVENTS (next 24h): ${JSON.stringify(existingEvents)}
    NEW EVENT CANDIDATE: ${JSON.stringify(newEvent)}
    
    CRITICAL ANALYZER:
    1. Check for time overlaps.
    2. Check ENERGY ALIGNMENT:
       - Morning (8am-12pm): Energy peaks. Prefer 'deep_work' or high-priority meetings.
       - Afternoon (1pm-4pm): Energy dip. Suggest 'admin' or low-priority tasks.
    3. PRIORITY RESOLUTION:
       - If conflict: Higher priority wins.
       - If priority is equal: Keep existing event unless new event is more critical.
    
    OUTPUT FORMAT (JSON):
    {
      "conflict": boolean,
      "conflicting_events": string[], // IDs of conflicting events
      "action": "schedule" | "reschedule_existing" | "suggest_alternative",
      "suggested_start_time": string, // ISO 8601, only if action is 'suggest_alternative' or 'reschedule_existing'
      "analysis": string // Short tactical explanation
    }
  `;
  
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      systemInstruction: "You are a tactical operations scheduler. Analyze overlaps and energy alignment. Prioritize executive function during energy peaks.",
      responseMimeType: "application/json",
    },
  });

  return JSON.parse(response.text || "{}");
}
