# KRONOS AI: Ultimate Tactical Calendar

KRONOS AI is a high-performance, AI-driven calendar application designed for autonomous scheduling and tactical time management. It leverages the power of Gemini AI to parse natural language commands and Firebase for secure, real-time data persistence.

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
- **Backend/Database**: Firebase (Auth, Firestore)
- **Intelligence**: Google Gemini API
- **Testing**: Vitest, React Testing Library
- **Icons/UI**: Lucide React, Sonner (Toasts), Date-fns

## 🔐 Security First Setup

### Prerequisites

- Node.js (v18+)
- Firebase Account
- Google AI Studio API Key

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd kronos-ai
   ```

2. **Run the secure setup script**
   ```bash
   ./setup-dev.sh
   ```
   
   This will:
   - Create `firebase-applet-config.local.json` (gitignored)
   - Create `.env` from `.env.example` (gitignored)
   - Remind you to add your real credentials

3. **Add your Firebase credentials**
   
   Edit `firebase-applet-config.local.json`:
   ```json
   {
     "projectId": "your-actual-project-id",
     "appId": "your-actual-app-id",
     "apiKey": "your-actual-api-key",
     "authDomain": "your-project.firebaseapp.com",
     "firestoreDatabaseId": "your-database-id",
     "storageBucket": "your-project.firebasestorage.app",
     "messagingSenderId": "your-sender-id",
     "measurementId": ""
   }
   ```

4. **Add your other API keys**
   
   Edit `.env`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_key
   ```

5. **Install dependencies**
   ```bash
   npm install
   ```

6. **Run Firestore security rules**
   ```bash
   # Deploy your firestore.rules to Firebase Console
   # or use Firebase CLI:
   firebase deploy --only firestore:rules
   ```

7. **Start development server**
   ```bash
   npm run dev
   ```

## 🧪 Testing

Run the test suite to ensure tactical integrity:
```bash
npm test
```

## 🚨 Security Warnings

### Files That Should NEVER Be Committed

- ❌ `firebase-applet-config.local.json` - Contains real Firebase secrets
- ❌ `.env` - Contains all API keys
- ✅ `firebase-applet-config.json` - Safe placeholder template
- ✅ `.env.example` - Safe example template

### If You Accidentally Commit Secrets

1. **Immediately rotate all exposed credentials**
   - Firebase: Console → Project Settings → Delete/regenerate API key
   - Gemini: Google AI Studio → Regenerate API key
   - Supabase: Dashboard → Settings → Regenerate keys

2. **Remove from Git history**
   ```bash
   # Use BFG Repo Cleaner or git-filter-repo
   # Consult security team before proceeding
   ```

3. **Force push the cleaned history**
   ```bash
   git push --force
   ```

## 📁 Project Structure

```
kronos-ai/
├── src/
│   ├── components/       # React components
│   ├── services/         # API services (Gemini, Calendar)
│   ├── lib/             # Utilities
│   ├── firebase.ts      # Firebase initialization (uses .local.json)
│   └── types.ts         # TypeScript types
├── components/ui/       # Shadcn UI components
├── firebase-applet-config.json          # ✅ Safe template (commit this)
├── firebase-applet-config.local.json    # ❌ Real secrets (gitignored)
├── .env.example         # ✅ Safe template (commit this)
├── .env                 # ❌ Real secrets (gitignored)
├── firestore.rules      # Firestore security rules
└── setup-dev.sh         # Secure setup script
```

## 🔥 Firebase Setup

1. Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication → Google Sign-In
3. Create a Firestore database
4. Deploy security rules from `firestore.rules`
5. Copy your config to `firebase-applet-config.local.json`

## 🤖 Gemini AI Setup

1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to `.env` as `GEMINI_API_KEY`

## 📊 Supabase Setup (Optional - for Feedback)

1. Create project at [supabase.com](https://supabase.com)
2. Run `supabase_migration.sql` in SQL Editor
3. Add credentials to `.env`

## 🎯 Production Deployment

For production, use environment variables instead of config files:

```bash
# Set these in your hosting platform (Vercel, Netlify, Firebase Hosting, etc.)
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
# ... etc
```

## 📝 Development Workflow

```bash
# Start dev server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run lint
```

## 🛡️ Security Best Practices

✅ Use `.env` files for secrets (already gitignored)  
✅ Use separate Firebase projects for dev/staging/prod  
✅ Never hardcode API keys in source code  
✅ Rotate credentials every 90 days  
✅ Enable Firebase App Check for production  
✅ Review Firestore security rules regularly  

## 📄 License

This project is licensed under the Apache 2.0 License.

---

*Built with operational excellence for the modern digital operative.*

**⚠️ Remember**: Security is not a feature, it's a requirement. Protect your secrets like you protect your time.
