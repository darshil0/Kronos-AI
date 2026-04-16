export type Persona = 'work' | 'family' | 'side';
export type EventType = 'meeting' | 'task' | 'deep_work' | 'admin' | 'travel';
export type EventStatus = 'confirmed' | 'proposed' | 'ghost' | 'cancelled';

export interface UserProfile {
  id: string;
  email: string;
  energy_profile: {
    peaks: string[]; // e.g. ["08:00-11:00"]
    lows: string[];  // e.g. ["14:00-16:00"]
  };
  preferences: {
    personas: Persona[];
    priorities: Record<string, number>;
  };
  created_at: string;
}

export interface CalendarEvent {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  persona: Persona;
  priority: number; // 1-10
  type: EventType;
  location?: string;
  energy_score: number; // 1-10
  status: EventStatus;
  action_items: string[];
  external_id?: string; // Nylas event ID
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  event_id: string;
  title: string;
  due_time: string;
  priority: number;
  completed: boolean;
}

export interface DailyDigest {
  id: string;
  user_id: string;
  date: string;
  content: string; // AI generated summary
  sent_at: string;
}
