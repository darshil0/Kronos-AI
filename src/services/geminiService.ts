import { GoogleGenAI, Type } from "@google/genai";
import { CalendarEvent } from "../types";

const getApiKey = (): string => {
  if (typeof process !== "undefined" && process.env?.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY;
  }
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_GEMINI_API_KEY) {
    return import.meta.env.VITE_GEMINI_API_KEY;
  }
  return "";
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

/**
 * Safely parses JSON strings returned by AI model outputs,
 * stripping markdown code fence blocks if present.
 */
export function parseAIJsonResponse<T = Record<string, unknown>>(
  text: string | null | undefined,
): T {
  if (!text) return {} as T;
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch (error) {
    console.error("Failed to parse AI JSON response:", error, "Raw text:", text);
    return {} as T;
  }
}

export async function parseSchedulingPrompt(
  prompt: string,
  currentTime: string = new Date().toISOString(),
) {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Current Time: ${currentTime}\nPrompt: ${prompt}`,
    config: {
      systemInstruction:
        "You are the Ultimate AI Calendar assistant. Parse natural language scheduling requests relative to Current Time. Return a JSON object with title, start_time (ISO 8601 string relative to Current Time), duration_minutes (number), priority (1-10, default 5), type ('meeting', 'task', 'deep_work', 'admin', 'travel'), and persona ('work', 'family', 'side'). If details such as date or time are unspecified or ambiguous, infer reasonable defaults based on Current Time and state assumptions clearly in action_items.",
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
        required: [
          "title",
          "start_time",
          "duration_minutes",
          "priority",
          "type",
          "persona",
        ],
      },
    },
  });

  return parseAIJsonResponse<Record<string, any>>(response.text);
}

export async function resolveConflicts(
  existingEvents: CalendarEvent[],
  newEvent: Record<string, unknown>,
) {
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
      systemInstruction:
        "You are a tactical operations scheduler. Analyze schedule overlaps and energy alignment relative to time of day. Prioritize executive function during morning energy peaks (08:00-12:00) and lighter tasks during afternoon dips (13:00-16:00). Output clear JSON matching the requested structure.",
      responseMimeType: "application/json",
    },
  });

  return parseAIJsonResponse<Record<string, any>>(response.text);
}
