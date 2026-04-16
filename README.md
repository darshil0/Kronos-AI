# KRONOS AI: Ultimate Tactical Calendar

KRONOS AI is a high-performance, AI-driven calendar application designed for autonomous scheduling and tactical time management. It leverages the power of Gemini AI to parse natural language commands and Firebase for secure, real-time data persistence.

## 🚀 Features

- **Autonomous Command Center**: Schedule meetings, tasks, and deep work blocks using natural language.
- **Multi-Persona Alignment**: Categorize your life into Work, Family, and Side Projects with distinct visual markers.
- **AI Insights Engine**: Receive real-time energy peak analysis and gaps suggestions to maintain peak tactical momentum.
- **Tactical Calendar Grid**: A high-contrast, interactive grid with full CRUD (Create, Read, Update, Delete) capabilities via the Event Intel Dialog.
- **Professional Polish Design**: A sleek, dark-mode "God Mode" interface with glassmorphism and tactical accents.

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn UI, Framer Motion
- **Backend/Database**: Firebase (Auth, Firestore)
- **Intelligence**: Google Gemini API
- **Testing & Quality Control**: ESLint, Prettier
- **Icons/UI**: Lucide React, Sonner (Toasts), Date-fns

## 🏁 Getting Started

### ⚠️ Security Notice
We recently performed a security audit and sanitized sensitive credentials. Please refer to [SECURITY_FIX.md](./SECURITY_FIX.md) for details and mandatory rotation instructions.

### Prerequisites

- Node.js (v18+)
1. **Environment Variables**: Clone `.env.example` to `.env` and populate the following:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   GEMINI_API_KEY=your_gemini_api_key
   ```

2. **Firebase Setup**: Ensure your Firebase project is configured with Authentication (Google Provider) and Firestore Database. Refer to [SECURITY_FIX.md](./SECURITY_FIX.md) for local configuration details.

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
