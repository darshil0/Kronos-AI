/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Bell, UserRound } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/AuthContext";
import { AIInsights } from "@/components/AIInsights";
import { CalendarGrid } from "@/components/CalendarGrid";
import { CommandCenter } from "@/components/CommandCenter";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoginScreen } from "@/components/LoginScreen";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function App() {
  const { user, loading } = useAuth();

  const handleNotifications = () => {
    try {
      toast.info("All systems operational. No unread alerts.", {
        id: "notifications-status",
      });
    } catch (error) {
      console.error("Unable to show notifications status:", error);
    }
  };

  const handleProfileClick = () => {
    toast.info(user.email ?? "User profile");
  };

  if (loading) {
    return (
      <div
        className="glass-dark flex min-h-screen w-full items-center justify-center"
        role="status"
        aria-live="polite"
        aria-label="Synchronizing account data"
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500/20 border-t-blue-500"
            aria-hidden="true"
          />

          <p className="animate-pulse font-mono text-sm tracking-widest text-white/40">
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

          <main className="flex min-w-0 flex-1 flex-col bg-black/10">
            <header className="glass flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-black/50 px-6 backdrop-blur-md">
              <div className="flex max-w-2xl flex-1 items-center">
                <CommandCenter />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Show notification status"
                  onClick={handleNotifications}
                  className="text-white hover:bg-white/10"
                >
                  <Bell className="h-5 w-5" aria-hidden="true" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Open profile for ${user.email ?? "current user"}`}
                  title={user.email ?? "User profile"}
                  onClick={handleProfileClick}
                  className="rounded-full p-0 hover:bg-transparent focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-gradient-to-tr from-blue-500 to-purple-600 transition-transform hover:scale-105"
                    aria-hidden="true"
                  >
                    <UserRound className="h-4 w-4 text-white" />
                  </span>
                </Button>
              </div>
            </header>

            <div className="flex min-h-0 flex-1 overflow-hidden">
              <CalendarGrid />
              <AIInsights />
            </div>
          </main>
        </div>

        <Toaster richColors closeButton />
      </TooltipProvider>
    </ErrorBoundary>
  );
}
