# 🔐 Security Fix: Sensitive Data Sanitization

## summary

We identified that real Firebase credentials (including API Key) were committed to the repository in `firebase-applet-config.json`. This poses a security risk as these secrets would be exposed in version control.

## 🛠 Actions Taken

1.  **Sanitized `firebase-applet-config.json`**: Replaced all sensitive values with placeholders (`YOUR_API_KEY`, etc.).
2.  **Created `firebase-applet-config.local.json`**: This file is intended for local development and contains the original credentials.
3.  **Updated `.gitignore`**: Added `firebase-applet-config.local.json` and ensured `.env*` files are ignored to prevent future leaks.
4.  **Refactored `src/firebase.ts`**: Updated the initialization logic to prioritize environment variables (`VITE_FIREBASE_*`) with fallbacks to the configuration files.
5.  **Updated `.env.example`**: Added the new Firebase environment variables.
6.  **Created `setup-dev.sh`**: A utility script to help developers set up their local configuration safely.

## ⚠️ MANDATORY SECURITY ACTIONS

**If your credentials were exposed, you MUST perform the following steps immediately:**

1.  **Rotate your Firebase API Key**:
    - Go to the [Firebase Console](https://console.firebase.google.com/).
    - Navigate to **Project Settings** > **General**.
    - Find your Web API Key and rotate/replace it.
    - **Delete the old exposed key** (ending in `...1WZHCc`).
2.  **Review Security Rules**: Ensure your Firestore and Storage security rules are strictly enforced and do not allow unauthorized access.
3.  **Check Logs**: Audit your Firebase Authentication and Cloud Logging for any suspicious activity from the period the keys were exposed.

## 💻 Developer Setup

To set up your local environment securely:

1.  Run `./setup-dev.sh` (if on Linux/macOS) or manually copy `firebase-applet-config.json` to `firebase-applet-config.local.json` and fill in your secrets.
2.  Populate your local `.env` file with the variables defined in `.env.example`.

---

_Maintained by the KRONOS AI Security Team._
