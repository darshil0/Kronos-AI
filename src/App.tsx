/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sidebar } from "./components/Sidebar";
import { CalendarGrid } from "./components/CalendarGrid";
import { CommandCenter } from "./components/CommandCenter";
import { AIInsights } from "./components/AIInsights";
import { Bell } from "lucide-react";
import { Button } from "../components/ui/button";
import { TooltipProvider } from "../components/ui/tooltip";
import { Toaster } from "../components/ui/sonner";

import { ErrorBoundary } from "./components/ErrorBoundary";
import { useAuth } from "./AuthContext";
import { LoginScreen } from "./components/LoginScreen";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center glass-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-white/40 font-mono text-sm tracking-widest animate-pulse">
            SYNCHRONIZING...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <ErrorBoundary>
      <TooltipProvider>
        <div className="flex h-screen w-full overflow-hidden">
          <Sidebar />

          <main className="flex-1 flex flex-col min-w-0 bg-black/10">
            {/* Header */}
            <header className="h-16 border-b border-white/10 glass flex items-center justify-between px-6 shrink-0 bg-black/50 backdrop-blur-md">
              <div className="flex items-center flex-1 max-w-2xl">
                <CommandCenter />
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10"
                >
                  <Bell className="h-5 w-5" />
                </Button>
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 border border-white/20 cursor-pointer hover:scale-105 transition-transform" />
              </div>
            </header>

            {/* Dash Content */}
            <div className="flex-1 flex overflow-hidden">
              <CalendarGrid />
              <AIInsights />
            </div>
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </ErrorBoundary>
  );
}
