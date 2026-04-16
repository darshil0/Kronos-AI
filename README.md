# KRONOS AI: Ultimate Tactical Calendar

KRONOS AI is a high-performance, AI-driven calendar application designed for autonomous scheduling and tactical time management. It leverages the power of Gemini AI to parse natural language commands and Firebase for secure, real-time data persistence.

## 🚀 Features

- **Autonomous Command Center**: Schedule meetings, tasks, and deep work blocks using high-fidelity natural language processing.
- **Dynamic Energy Analysis**: Real-time AI prediction of energy scores (1-10) for every event to optimize tactical demand.
- **Chronos Grid Navigation**: Interactive month-to-month traverse with high-visibility "Today" situational awareness.
- **Direct Tactical Planning**: Create, edit, and terminate missions directly from the grid with the Multimodal Event Intel Dialog.
- **Internal System Views**: Instant switching between Calendar, AI Insights, and System Settings via the Tactical Sidebar.
- **Professional Polish ("God Mode")**: A sleek, dark-mode interface utilizing glassmorphism, tactical gradients, and ambient reactive glows.

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS 4, Shadcn UI, Framer Motion
- **Backend/Database**: Firebase (Authentication, Firestore Database)
- **Intelligence**: Google Gemini-1.5-Pro API
- **Quality Control**: ESLint, Prettier (Integrated Workflows)
- **Icons/UI**: Lucide React, Sonner (Tactical Toasts), Date-fns

## 🏁 Getting Started

### ⚠️ Security Notice
We recently performed a security audit and sanitized sensitive credentials. Please refer to [SECURITY_FIX.md](./SECURITY_FIX.md) for details and mandatory rotation instructions.

### Prerequisites

- Node.js (v18+)
- Firebase Project (Auth & Firestore enabled)
- Google AI Studio API Key

### Configuration

1. **Environment Variables**: Clone `.env.example` to `.env` and populate the following:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   GEMINI_API_KEY=your_gemini_api_key
   ```

2. **Local Secrets**: Run `./setup-dev.sh` or manually create `firebase-applet-config.local.json` with your Firebase project configurations.

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Start Operations**:
   ```bash
   npm run dev
   ```

## 🧪 System Hygiene & Quality

Maintain tactical integrity with built-in quality workflows:

```bash
# Perform autonomous code normalization
npm run format

# Execute strict pattern analysis
npm run lint

# Validate type safety
npm run lint:types
```

---
*Built with operational excellence for the modern digital operative.*
