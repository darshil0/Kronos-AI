// src/__tests__/UserFeedbackForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { UserFeedbackForm } from '../components/UserFeedbackForm';
import { supabase } from '../lib/supabaseClient';

vi.mock('../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(() => ({
      insert: vi.fn(),
    })),
  },
}));

describe('UserFeedbackForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (supabase.auth.getUser as Mock).mockResolvedValue({ data: { user: null }, error: null });
    ((supabase.from as Mock)().insert as Mock).mockResolvedValue({ error: null });
  });

  it('renders correctly when user is not logged in', async () => {
    render(<UserFeedbackForm />);
    const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement;
    expect(emailInput.value).toBe('');
  });

  it('pre-fills email when user is logged in', async () => {
    (supabase.auth.getUser as Mock).mockResolvedValue({
      data: { user: { email: 'operator@kronos.ai' } },
      error: null,
    });
    
    render(<UserFeedbackForm />);
    
    await waitFor(() => {
      const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement;
      expect(emailInput.value).toBe('operator@kronos.ai');
    });
  });

  it('shows validation errors for empty required fields', async () => {
    render(<UserFeedbackForm />);
    const submitButton = screen.getByRole('button', { name: /Submit/i });
    
    fireEvent.click(submitButton);
    
    // HTML5 native validation might stop it, or our internal check
    // Our internal check for valid email happens first
    expect(await screen.findByText(/Please enter a valid email address/i)).toBeInTheDocument();
  });

  it('calls supabase.from().insert() with correct payload on valid submit', async () => {
    (supabase.auth.getUser as Mock).mockResolvedValue({
      data: { user: { email: 'admin@kronos.ai' } },
      error: null,
    });

    render(<UserFeedbackForm />);
    
    await waitFor(() => expect((screen.getByLabelText(/Email/i) as HTMLInputElement).value).toBe('admin@kronos.ai'));

    fireEvent.change(screen.getByLabelText(/Subject/i), { target: { value: 'Bug' } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'Fix this' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('feedback');
      expect(((supabase.from as Mock)().insert as Mock)).toHaveBeenCalledWith([{
        email: 'admin@kronos.ai',
        subject: 'Bug',
        message: 'Fix this'
      }]);
    });
  });

  it('shows success message after successful submission', async () => {
    render(<UserFeedbackForm />);
    
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/Subject/i), { target: { value: 'Hi' } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'Hello' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    expect(await screen.findByText(/Feedback Sent!/i)).toBeInTheDocument();
  });

  it('shows error message when Supabase returns an error', async () => {
    ((supabase.from as Mock)().insert as Mock).mockResolvedValue({ error: { message: 'Database failure' } });
    
    render(<UserFeedbackForm />);
    
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/Subject/i), { target: { value: 'Hi' } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'Hello' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    expect(await screen.findByText(/Database failure/i)).toBeInTheDocument();
  });

  it('disables submit button while loading', async () => {
    // Delayed mock
    ((supabase.from as Mock)().insert as Mock).mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ error: null }), 100)));
    
    render(<UserFeedbackForm />);
    
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/Subject/i), { target: { value: 'Hi' } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'Hello' } });
    
    const submitButton = screen.getByRole('button', { name: /Submit/i });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/Transmitting/i);
  });
});
