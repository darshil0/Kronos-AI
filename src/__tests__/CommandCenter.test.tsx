import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CommandCenter } from "../components/CommandCenter";
import { parseSchedulingPrompt } from "../services/geminiService";
import { toast } from "sonner";

vi.mock("../services/geminiService", () => ({
  parseSchedulingPrompt: vi.fn(),
  resolveConflicts: vi.fn(),
}));

vi.mock("../services/calendarService", () => ({
  calendarService: {
    fetchNearbyEvents: vi.fn().mockResolvedValue([]),
    addEvent: vi.fn().mockResolvedValue("event-id"),
  },
}));

vi.mock("../AuthContext", () => ({
  useAuth: () => ({
    user: { uid: "user123" },
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    loading: vi.fn().mockReturnValue("toast-id"),
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe("CommandCenter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with accessible aria-label", () => {
    render(<CommandCenter />);
    const input = screen.getByLabelText("Autonomous scheduling command input");
    expect(input).toBeInTheDocument();
  });

  it("shows error toast when AI fails to extract valid title/start_time", async () => {
    vi.mocked(parseSchedulingPrompt).mockResolvedValueOnce({
      title: "",
      start_time: "invalid-date",
    });

    render(<CommandCenter />);
    const input = screen.getByLabelText("Autonomous scheduling command input");

    fireEvent.change(input, { target: { value: "do something vague" } });
    fireEvent.submit(input.closest("form")!);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Unable to parse request. Please include an event title and time (e.g., 'Sync with Team tomorrow at 10am').",
        { id: "toast-id" },
      );
    });
  });
});
