// src/__tests__/UserFeedbackForm.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserFeedbackForm } from "../components/UserFeedbackForm";
import { supabase } from "../lib/supabaseClient";

const mockInsert = vi.fn();
const mockGetUser = vi.fn();

vi.mock("../lib/supabaseClient", () => ({
  supabase: {
    auth: {
      getUser: vi.fn((...args) => mockGetUser(...args)),
    },
    from: vi.fn(() => ({
      insert: vi.fn((...args) => mockInsert(...args)),
    })),
  },
}));

describe("UserFeedbackForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });
    mockInsert.mockResolvedValue({ error: null });
  });

  it("renders correctly when user is not logged in", async () => {
    render(<UserFeedbackForm />);
    const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement;
    expect(emailInput.value).toBe("");
  });

  it("pre-fills email when user is logged in", async () => {
    (supabase.auth.getUser as any).mockResolvedValue({
      data: { user: { email: "operator@kronos.ai" } },
      error: null,
    });

    render(<UserFeedbackForm />);

    await waitFor(() => {
      const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement;
      expect(emailInput.value).toBe("operator@kronos.ai");
    });
  });

  it("shows validation errors for empty required fields", async () => {
    render(<UserFeedbackForm />);
    const submitButton = screen.getByRole("button", {
      name: /Submit Transmission/i,
    });

    fireEvent.click(submitButton);

    // HTML5 native validation might stop it, or our internal check
    // Our internal check for valid email happens first
    expect(
      await screen.findByText(/Please enter a valid email address/i),
    ).toBeInTheDocument();
  });

  it("calls supabase.from().insert() with correct payload on valid submit", async () => {
    (supabase.auth.getUser as any).mockResolvedValue({
      data: { user: { email: "admin@kronos.ai" } },
      error: null,
    });

    render(<UserFeedbackForm />);

    await waitFor(() =>
      expect((screen.getByLabelText(/Email/i) as HTMLInputElement).value).toBe(
        "admin@kronos.ai",
      ),
    );

    fireEvent.change(screen.getByLabelText(/Subject/i), {
      target: { value: "Bug" },
    });
    fireEvent.change(screen.getByLabelText(/Message/i), {
      target: { value: "Fix this" },
    });

    const submitBtn = screen.getByRole("button", {
      name: /Submit Transmission/i,
    });
    await fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith("feedback");
      expect(mockInsert).toHaveBeenCalledWith([
        {
          email: "admin@kronos.ai",
          subject: "Bug",
          message: "Fix this",
        },
      ]);
    });
  });

  it("shows success message after successful submission", async () => {
    render(<UserFeedbackForm />);

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/Subject/i), {
      target: { value: "Hi" },
    });
    fireEvent.change(screen.getByLabelText(/Message/i), {
      target: { value: "Hello" },
    });

    const submitBtn = screen.getByRole("button", {
      name: /Submit Transmission/i,
    });
    await fireEvent.click(submitBtn);

    expect(await screen.findByText(/Feedback Sent!/i)).toBeInTheDocument();
  });

  it("shows error message when Supabase returns an error", async () => {
    mockInsert.mockResolvedValue({
      error: { message: "Database failure" },
    });

    render(<UserFeedbackForm />);

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/Subject/i), {
      target: { value: "Hi" },
    });
    fireEvent.change(screen.getByLabelText(/Message/i), {
      target: { value: "Hello" },
    });

    const submitBtn = screen.getByRole("button", {
      name: /Submit Transmission/i,
    });
    await fireEvent.click(submitBtn);

    expect(await screen.findByText(/Database failure/i)).toBeInTheDocument();
  });

  it("disables submit button while loading", async () => {
    // Delayed mock
    mockInsert.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ error: null }), 100),
        ),
    );

    render(<UserFeedbackForm />);

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/Subject/i), {
      target: { value: "Hi" },
    });
    fireEvent.change(screen.getByLabelText(/Message/i), {
      target: { value: "Hello" },
    });

    const submitButton = screen.getByRole("button", {
      name: /Submit Transmission/i,
    });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/Transmitting/i);
  });
});
