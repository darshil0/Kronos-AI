// src/__tests__/integration/feedbackFlow.test.ts
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { UserFeedbackForm } from '../../components/UserFeedbackForm';
import { supabase } from '../../lib/supabaseClient';

const { mockInsert, mockFrom } = vi.hoisted(() => ({
  mockInsert: vi.fn(),
  mockFrom: vi.fn(() => ({
    insert: vi.fn(),
  })),
}));

// Re-wire mockInsert to the one inside mockFrom
mockFrom.mockReturnValue({ insert: mockInsert });

vi.mock('../../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    from: mockFrom,
  },
}));

describe('Integration: Feedback Submission Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInsert.mockResolvedValue({ error: null });
  });

  it('completes full flow: user fills form → submits → success shown', async () => {
    // 1. Mock user as logged in
    (supabase.auth.getUser as Mock).mockResolvedValue({
      data: { user: { email: 'pilot@kronos.ai' } },
      error: null,
    });

    render(<UserFeedbackForm />);

    // 3. Verify email is pre-filled
    await waitFor(() => {
      const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement;
      expect(emailInput.value).toBe('pilot@kronos.ai');
    });

    // 4. Fill in other fields
    fireEvent.change(screen.getByLabelText(/Subject/i), { target: { value: 'Operational Review' } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'Schedule optimization is working' } });

    // 5. Submit
    fireEvent.click(screen.getByRole('button', { name: /Submit Transmission/i }));

    // 6. Verify row inserted with correct sanitized data
    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledWith([{
        email: 'pilot@kronos.ai',
        subject: 'Operational Review',
        message: 'Schedule optimization is working'
      }]);
    });

    // 7. Success message
    expect(await screen.findByText(/Feedback Sent!/i)).toBeInTheDocument();
  });

  it('handles login mid-session simulation (email pre-fill triggers on render)', async () => {
    // Current setup triggers on mount. Simulation: form rendered -> auth state changed -> email updated implies re-render or internal effect update
    // Simulation: user logs in -> component renders
    (supabase.auth.getUser as Mock).mockResolvedValue({
      data: { user: { email: 'new-user@kronos.ai' } },
      error: null,
    });

    render(<UserFeedbackForm />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('new-user@kronos.ai')).toBeInTheDocument();
    });
  });
});
