import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  parseAIJsonResponse,
  parseSchedulingPrompt,
  resolveConflicts,
} from "../services/geminiService";

const { mockGenerateContent } = vi.hoisted(() => ({
  mockGenerateContent: vi.fn(),
}));

vi.mock("@google/genai", () => {
  return {
    GoogleGenAI: class {
      models = {
        generateContent: mockGenerateContent,
      };
    },
    Type: {
      OBJECT: "OBJECT",
      STRING: "STRING",
      NUMBER: "NUMBER",
      ARRAY: "ARRAY",
    },
  };
});

describe("geminiService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("parseAIJsonResponse", () => {
    it("parses valid raw JSON string", () => {
      const jsonStr = '{"title": "Sync Meeting", "priority": 5}';
      const result = parseAIJsonResponse(jsonStr);
      expect(result).toEqual({ title: "Sync Meeting", priority: 5 });
    });

    it("strips markdown code fence blocks", () => {
      const jsonStr = "```json\n{\n  \"title\": \"Deep Work\"\n}\n```";
      const result = parseAIJsonResponse(jsonStr);
      expect(result).toEqual({ title: "Deep Work" });
    });

    it("handles empty or null text safely", () => {
      expect(parseAIJsonResponse(null)).toEqual({});
      expect(parseAIJsonResponse(undefined)).toEqual({});
      expect(parseAIJsonResponse("")).toEqual({});
    });

    it("handles invalid malformed JSON safely without throwing", () => {
      const spyError = vi.spyOn(console, "error").mockImplementation(() => {});
      const result = parseAIJsonResponse("{ invalid json ");
      expect(result).toEqual({});
      expect(spyError).toHaveBeenCalled();
      spyError.mockRestore();
    });
  });

  describe("parseSchedulingPrompt", () => {
    it("calls model with correctly formatted parameters and parses structured JSON", async () => {
      mockGenerateContent.mockResolvedValueOnce({
        text: '{"title":"Design Sync","start_time":"2026-06-01T10:00:00Z","duration_minutes":60,"priority":8,"type":"meeting","persona":"work"}',
      });

      const result = await parseSchedulingPrompt("Design sync tomorrow at 10am", "2026-05-31T00:00:00Z");

      expect(mockGenerateContent).toHaveBeenCalled();
      const callArgs = mockGenerateContent.mock.calls[0][0];
      expect(callArgs.contents).toContain("Design sync tomorrow at 10am");
      expect(callArgs.contents).toContain("2026-05-31T00:00:00Z");
      expect(result).toEqual({
        title: "Design Sync",
        start_time: "2026-06-01T10:00:00Z",
        duration_minutes: 60,
        priority: 8,
        type: "meeting",
        persona: "work",
      });
    });
  });

  describe("resolveConflicts", () => {
    it("calls model to evaluate overlaps and parses tactical conflict response", async () => {
      mockGenerateContent.mockResolvedValueOnce({
        text: '{"conflict":true,"conflicting_events":["e1"],"action":"suggest_alternative","suggested_start_time":"2026-06-01T11:00:00Z","analysis":"Shifted to avoid overlap"}',
      });

      const existingEvents = [
        {
          id: "e1",
          user_id: "u1",
          title: "Existing Standup",
          start_time: "2026-06-01T10:00:00Z",
          end_time: "2026-06-01T10:30:00Z",
          persona: "work" as const,
          priority: 5,
          type: "meeting" as const,
          status: "confirmed" as const,
          energy_score: 5,
          action_items: [],
          created_at: "2026-06-01T00:00:00Z",
        },
      ];

      const newEvent = {
        title: "Sprint Prep",
        start_time: "2026-06-01T10:00:00Z",
        duration_minutes: 60,
      };

      const result = await resolveConflicts(existingEvents, newEvent);

      expect(mockGenerateContent).toHaveBeenCalled();
      expect(result).toEqual({
        conflict: true,
        conflicting_events: ["e1"],
        action: "suggest_alternative",
        suggested_start_time: "2026-06-01T11:00:00Z",
        analysis: "Shifted to avoid overlap",
      });
    });
  });
});
