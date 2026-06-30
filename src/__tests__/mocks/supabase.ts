// src/__tests__/mocks/supabase.ts
import { vi } from "vitest";

export const mockInsert = vi.fn();
export const mockFrom = vi.fn(() => ({
  insert: mockInsert,
}));

export const mockGetUser = vi.fn();

export const supabaseMock = {
  auth: {
    getUser: mockGetUser,
  },
  from: mockFrom,
};

// Default implementations
mockInsert.mockResolvedValue({ error: null });
mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
