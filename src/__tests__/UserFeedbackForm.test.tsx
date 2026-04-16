// src/__tests__/UserFeedbackForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserFeedbackForm } from '../components/UserFeedbackForm';
import { supabase } from '../lib/supabaseClient';
import { mockInsert, mockGetUser } from './mocks/supabase';

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
    (supabase.auth.getUser as any).mockResolvedValue({ data: { user: null }, error: null });
    const insertMock = vi.fn().mockResolvedValue({ data: null, error: null });
    (supabase.from as any).mockReturnValue({
      insert: insertMock,
    });
  });

  it('renders correctly when user is not logged in', async () => {
    render(<UserFeedbackForm />);
    const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement;
    expect(emailInput.value).toBe('');
  });

  it('pre-fills email when user is logged in', async () => {
    (supabase.auth.getUser as any).mockResolvedValue({
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
    (supabase.auth.getUser as any).mockResolvedValue({
      data: { user: { email: 'admin@kronos.ai' } },
      error: null,
    });

    const insertMock = vi.fn().mockResolvedValue({ data: null, error: null });
    (supabase.from as any).mockReturnValue({
      insert: insertMock,
    });

    render(<UserFeedbackForm />);
    
    await waitFor(() => expect((screen.getByLabelText(/Email/i) as HTMLInputElement).value).toBe('admin@kronos.ai'));

    fireEvent.change(screen.getByLabelText(/Subject/i), { target: { value: 'Bug' } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'Fix this' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('feedback');
      expect(insertMock).toHaveBeenCalledWith([{
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
    const insertMock = vi.fn().mockResolvedValue({ error: { message: 'Database failure' } });
    (supabase.from as any).mockReturnValue({
      insert: insertMock,
    });
    
    render(<UserFeedbackForm />);
    
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/Subject/i), { target: { value: 'Hi' } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'Hello' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    expect(await screen.findByText(/Database failure/i)).toBeInTheDocument();
  });

  it('disables submit button while loading', async () => {
    // Delayed mock
    const insertMock = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ error: null }), 100)));
    (supabase.from as any).mockReturnValue({
      insert: insertMock,
    });
    
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
