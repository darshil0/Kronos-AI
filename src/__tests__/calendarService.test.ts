import { describe, it, expect, vi, beforeEach } from "vitest";
import { calendarService } from "../services/calendarService";
import { addDoc, updateDoc, deleteDoc, getDocs } from "firebase/firestore";
import { handleFirestoreError } from "../firebase";

// Mock Firebase Firestore
vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  addDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn(),
  updateDoc: vi.fn(),
  doc: vi.fn(),
  deleteDoc: vi.fn(),
  getFirestore: vi.fn(),
}));

vi.mock("../firebase", () => ({
  db: {},
  handleFirestoreError: vi.fn(),
  OperationType: {
    CREATE: "create",
    UPDATE: "update",
    DELETE: "delete",
    LIST: "list",
  },
}));

describe("calendarService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("addEvent", () => {
    it("successfully adds an event", async () => {
      const mockDocRef = { id: "new-event-id" };
      vi.mocked(addDoc).mockResolvedValueOnce(mockDocRef as any);

      const eventData = {
        user_id: "user123",
        title: "Test Event",
        start_time: "2026-06-01T10:00:00Z",
        end_time: "2026-06-01T11:00:00Z",
        persona: "work" as const,
        type: "meeting" as const,
        status: "confirmed" as const,
        priority: 5,
        energy_score: 5,
        action_items: [],
      };

      const result = await calendarService.addEvent(eventData);

      expect(addDoc).toHaveBeenCalled();
      expect(result).toBe("new-event-id");
    });

    it("handles error when addDoc fails", async () => {
      const error = new Error("Firestore failure");
      vi.mocked(addDoc).mockRejectedValueOnce(error);

      await calendarService.addEvent({} as any);

      expect(handleFirestoreError).toHaveBeenCalledWith(
        error,
        "create",
        "events",
      );
    });
  });

  describe("updateEvent", () => {
    it("successfully updates an event", async () => {
      vi.mocked(updateDoc).mockResolvedValueOnce(undefined);

      await calendarService.updateEvent("event-id", { title: "Updated Title" });

      expect(updateDoc).toHaveBeenCalled();
    });

    it("handles error when updateDoc fails", async () => {
      const error = new Error("Update failed");
      vi.mocked(updateDoc).mockRejectedValueOnce(error);

      await calendarService.updateEvent("event-id", {});

      expect(handleFirestoreError).toHaveBeenCalledWith(
        error,
        "update",
        "events/event-id",
      );
    });
  });

  describe("deleteEvent", () => {
    it("successfully deletes an event", async () => {
      vi.mocked(deleteDoc).mockResolvedValueOnce(undefined);

      await calendarService.deleteEvent("event-id");

      expect(deleteDoc).toHaveBeenCalled();
    });

    it("handles error when deleteDoc fails", async () => {
      const error = new Error("Delete failed");
      vi.mocked(deleteDoc).mockRejectedValueOnce(error);

      await calendarService.deleteEvent("event-id");

      expect(handleFirestoreError).toHaveBeenCalledWith(
        error,
        "delete",
        "events/event-id",
      );
    });
  });

  describe("fetchNearbyEvents", () => {
    it("successfully fetches events", async () => {
      const mockSnapshot = {
        docs: [
          {
            id: "event1",
            data: () => ({
              title: "Event 1",
              start_time: "2026-06-01T10:00:00Z",
            }),
          },
        ],
      };
      vi.mocked(getDocs).mockResolvedValueOnce(mockSnapshot as any);

      const events = await calendarService.fetchNearbyEvents(
        "user123",
        "2026-06-01T12:00:00Z",
      );

      expect(getDocs).toHaveBeenCalled();
      expect(events).toHaveLength(1);
      expect(events[0].id).toBe("event1");
      expect(events[0].title).toBe("Event 1");
    });

    it("returns empty array and handles error when fetch fails", async () => {
      const error = new Error("Fetch failed");
      vi.mocked(getDocs).mockRejectedValueOnce(error);

      const events = await calendarService.fetchNearbyEvents(
        "user123",
        "2026-06-01T12:00:00Z",
      );

      expect(events).toEqual([]);
      expect(handleFirestoreError).toHaveBeenCalledWith(
        error,
        "list",
        "events",
      );
    });
  });
});
