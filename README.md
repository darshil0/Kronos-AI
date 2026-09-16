# KRONOS AI: Ultimate Tactical Calendar

KRONOS AI is a high-performance, AI-driven calendar application designed for autonomous scheduling and tactical time management. It leverages the power of Gemini AI to parse natural language commands and Supabase for secure, real-time data persistence.

## 🚀 Features

- **Autonomous Command Center**: Schedule meetings, tasks, and deep work blocks using natural language.
- **Multi-Persona Alignment**: Categorize your life into Work, Family, and Side Projects with distinct visual markers.
- **AI Insights Engine**: Receive real-time energy peak analysis and gaps suggestions to maintain peak tactical momentum.
- **Tactical Calendar Grid**: A high-contrast, interactive grid with full CRUD (Create, Read, Update, Delete) capabilities via the Event Intel Dialog.
- **User Feedback Loop**: Integrated feedback system for continuous operational improvement.
- **Professional Polish Design**: A sleek, dark-mode "God Mode" interface with glassmorphism and tactical accents.

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn UI, Framer Motion
- **Backend/Database**: Supabase (Auth, Postgres, RLS)
- **Intelligence**: Google Gemini API
- **Testing**: Vitest, React Testing Library
- **Icons/UI**: Lucide React, Sonner (Toasts), Date-fns

## 🏁 Getting Started

### ⚠️ Security Notice

We recently performed a security audit and sanitized sensitive credentials. Please refer to [SECURITY_FIX.md](./SECURITY_FIX.md) for details and mandatory rotation instructions.

### Prerequisites

- Node.js (v18+)
- Supabase Account
- Google AI Studio API Key

### Configuration

1. **Environment Variables**: Clone `.env.example` to `.env` and populate the environment variables:

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
   VITE_FIREBASE_FIRESTORE_DATABASE_ID=your_firebase_firestore_database_id
   ```

2. **Database Setup**: Run the provided `supabase_migration.sql` in your Supabase SQL Editor to set up the `feedback` and `profiles` tables.

3. **Install Dependencies**:

   ```bash
   npm install
   ```

4. **Start Development**:
   ```bash
   npm run dev
   ```

## 🧪 Quality & Testing

Execute verification scripts to ensure tactical integrity and type safety:

- **Run Unit & Integration Tests**:
  ```bash
  npm test
  ```

- **Type Check & Lint**:
  ```bash
  npm run lint
  ```

- **Production Build**:
  ```bash
  npm run build
  ```

## 🤖 AI & Autonomous Engine

KRONOS AI utilizes Google Gemini (`gemini-3.1-pro-preview`) to process natural language scheduling requests and evaluate schedule overlaps.

- **Natural Language Parsing**: Directives in the Command Center are parsed relative to the current timestamp into structured calendar objects (title, ISO 8601 start time, duration, priority, persona, type).
- **Tactical Conflict Resolution**: Overlapping events trigger energy-alignment analysis (morning peak vs. afternoon dip) to suggest optimal rescheduling alternatives or proposed status changes.
- **Robust Output Handling**: Structured JSON outputs automatically handle model formatting fences and missing fields with graceful user-facing error guidance.

---

_Built with operational excellence for the modern digital operative. Optimized for AI-driven tactical scheduling._
