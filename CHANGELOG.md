# Changelog

All notable changes to the KRONOS AI project will be documented in this file.

## [1.7.0] - 2026-04-16

### Added
- **Dynamic Energy Analysis**: Integrated real-time energy score prediction into the `geminiService` and `CommandCenter`, allowing the AI to autonomously assess tactical demand.
- **Internal System Routing**: Implemented a state-driven navigation architecture within the `Sidebar` and `App` root to handle transitions between Calendar, Insights, and Settings views.
- **Brand Identity Overhaul**: Redesigned the `LoginScreen` with a bespoke tactical shield icon, gradient effects, and high-fidelity "God Mode" ambient glows.

### Fixed
- **Situational Awareness**: Enhanced the `CalendarGrid` with high-visibility "Today" highlighting and temporal status markers.
- **Temporal Paradox Shielding**: Implemented strict date-range validation in the `EventDialog` to prevent invalid event synthesis (end times before start times).

## [1.6.0] - 2026-04-16

### Added
- **Direct Tactical Planning**: Enabled the ability to authorize new missions (create events) directly by clicking empty spaces within the tactical calendar grid.
- **Dynamic Chronos Navigation**: Implemented interactive month navigation controls (Next, Previous, and Today) within the `CalendarGrid` header for seamless temporal shifting.
- **Multimodal Event Intel Dialog**: Refactored the `EventDialog` into a dual-purpose console that handles both existing event modification and new mission synthesis.

## [1.5.0] - 2026-04-16

### Changed
- **Project Structure Reorganization**: Consolidated all source code under the `src/` directory. Moved UI components to `src/components/ui`, application utilities to `src/lib`, and context providers to `src/context`. 
- **Internal Reference Audit**: Updated all cross-module import paths across the entire application to align with the new consolidated architecture.

## [1.4.1] - 2026-04-16

### Removed
- **Legacy Supabase Orchestration**: Permanently deprecated and removed the entirety of the shadowed Supabase environment (`UserFeedbackForm.tsx`, `supabaseClient.ts`, `feedbackUtils.ts`, `supabase_migration.sql`) to strictly unify database and security mechanisms under Firebase.
- **Orphaned Test Suites**: Deleted strictly-bound testing mock files and frameworks (`vitest.config.ts`, `src/__tests__`) originally purposed for the abandoned Supabase integration.
- **Unused Package Dependencies**: Stripped `package.json` testing tools (`vitest`, `@testing-library/*`, `jsdom`) and redundant API layers (`@supabase/supabase-js`) to heavily debloat the build process.
- **Dead UI Primitives**: Purged numerous unused presentation components across the `components/ui` namespace (`avatar.tsx`, `calendar.tsx`, `card.tsx`, `popover.tsx`, `sheet.tsx`, `skeleton.tsx`, `tabs.tsx`).

## [1.4.0] - 2026-04-16

### Added
- **Code Quality Ecosystem**: Successfully configured global ESLint and Prettier architecture integrated directly into standard package workflow routines.
- **Environment Safety Guardrails**: Designed human-readable exception logic preventing the web UI from mysteriously crashing if a local `.local.json` file wasn't configured prior to Firebase boot up.
- **Package Stability**: Restored missing core `@types/react` and `@types/react-dom` modules to securely anchor autocomplete context.

### Fixed
- **Anti-Pattern Extermination**: Liquidated wild `any` casting conventions within `geminiService.ts` and UI hooks by explicitly mapping them against rigid `CalendarEvent` interfaces and `unknown` type guards.
- **React Component Integrity**: Refactored `ErrorBoundary.tsx` breaking away from constructor type-loopholes (`this as any`) into natively validated generic class properties.

## [1.3.1] - 2026-04-16

### Fixed
- **TypeScript Config**: Enabled `resolveJsonModule` and `esModuleInterop` in `tsconfig.json` to allow correct importing of the JSON secrets configuration.
- **Linting**: Removed unused component imports (`Input`, `MessageSquare`, `Search`, `CalendarIcon`) across several components (`App.tsx`, `Sidebar.tsx`, `CommandCenter.tsx`) to resolve strict `tsc` compiler and linting warnings.

## [1.3.0] - 2026-04-16

### Added
- **Security Sanitization Layer**: Refactored `firebase.ts` to support environment variables and local secret files.
- **Developer Onboarding**: Added `setup-dev.sh` script to securely initialize local development credentials.
- **Security Documentation**: Created `SECURITY_FIX.md` with credential rotation protocols and audit summary.

### Fixed
- **Credential Leak**: Sanitized `firebase-applet-config.json` and moved real secrets to git-ignored `.local.json`.
- **TypeScript Stability**: Resolved persistent `TS2339` errors in `ErrorBoundary.tsx` using robust class property patterns.
- **Environment Parity**: Updated `.gitignore` to strictly exclude all environment and local config files.
- **Documentation**: Synchronized `README.md` with new security protocols.

## [1.2.0] - 2026-04-16

### Added
- **Autonomous Command Center**: New AI-powered input field in the header for natural language scheduling.
- **Event Intel Dialog**: Reusable dialog component for viewing, editing, and deleting calendar events.
- **AI Suggestion Engine**: Dynamic sidebar card that suggests scheduling actions based on calendar gaps.
- **Calendar CRUD Service**: Dedicated service for Firestore event management.
- **Vite Environment Types**: Added `src/vite-env.d.ts` for strictly typed environment variables.

### Fixed
- Corrected import paths for UI components in `CommandCenter.tsx` and `UserFeedbackForm.tsx`.
- Resolved `React` namespace issues in `skeleton.tsx` and `sonner.tsx`.
- Fixed property access in `ErrorBoundary.tsx`.
- Stabilized `CalendarGrid` click interactions.

## [1.1.0] - 2026-04-16

### Added
- **User Feedback System**: Full integration with Supabase (Auth + Postgres + RLS).
- **Migration Script**: `supabase_migration.sql` for setting up feedback tables and security policies.
- **Testing Suite**: Configured Vitest and added tests for `UserFeedbackForm` and utilities.

## [1.0.0] - 2026-04-16

### Added
- **Professional Polish Theme**: Initial visual design implementation with glassmorphism and tactical "God Mode" aesthetic.
- **Core Layout**: Sidebar, Header, and Calendar Grid structure.
- **Auth Integration**: Supabase authentication boilerplate.
- **AI Service**: Initial Gemini API integration for scheduling analysis.

---
*Generated by KRONOS AI Build Agent.*
