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
- **Testing & Quality Control**: Vitest, ESLint, Prettier
- **Icons/UI**: Lucide React, Sonner (Toasts), Date-fns

## 🏁 Getting Started

### ⚠️ Security Notice
We recently performed a security audit and sanitized sensitive credentials. Please refer to [SECURITY_FIX.md](./SECURITY_FIX.md) for details and mandatory rotation instructions.

### Prerequisites

- Node.js (v18+)
- Supabase Account
- Google AI Studio API Key

### Configuration

1. **Environment Variables**: Clone `.env.example` to `.env` and populate the following:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
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

## 🧪 Testing & Code Quality

Run the test suite to ensure tactical integrity:
```bash
npm run test
```

Perform autonomous code normalization (Prettier) and strict pattern analysis (ESLint):
```bash
npm run format
npm run lint
```

---
*Built with operational excellence for the modern digital operative.*
