import React from 'react';
import { Sidebar } from './components/Sidebar';
import { CalendarGrid } from './components/CalendarGrid';
import { CommandCenter } from './components/CommandCenter';
import { MessageSquare, Bell, Sparkles, Settings } from 'lucide-react';
import { Button } from './components/ui/button';
import { TooltipProvider } from './components/ui/tooltip';
import { Toaster } from './components/ui/sonner';

import { ErrorBoundary } from './components/ErrorBoundary';
import { useAuth } from './context/AuthContext';
import { LoginScreen } from './components/LoginScreen';

export default function App() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = React.useState('Calendar');

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center glass-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-white/40 font-mono text-sm tracking-widest animate-pulse">SYNCHRONIZING...</p>
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
        <div className="flex h-screen w-full overflow-hidden bg-black">
          <Sidebar currentView={currentView} onViewChange={setCurrentView} />
          
          <main className="flex-1 flex flex-col min-w-0 bg-black/10">
            {/* Header */}
            <header className="h-16 border-b border-white/10 glass flex items-center justify-between px-6 shrink-0 bg-black/50 backdrop-blur-md">
              <div className="flex items-center flex-1 max-w-2xl">
                <CommandCenter />
              </div>

              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Bell className="h-5 w-5" />
                </Button>
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 border border-white/20 cursor-pointer hover:scale-105 transition-transform" />
              </div>
            </header>

            {/* Dash Content */}
            <div className="flex-1 flex overflow-hidden">
              {currentView === 'Calendar' ? (
                <>
                  <CalendarGrid />
                  
                  {/* Insights Sidebar (Right) */}
                  <aside className="w-[280px] border-l border-white/10 glass-dark flex flex-col shrink-0">
                    <div className="p-6">
                      <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">AI Insights</h3>
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <p className="text-xs text-white/60 mb-1">Energy Peak</p>
                          <p className="text-lg font-bold text-blue-400">08:00 AM - 11:30 AM</p>
                        </div>
                        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 animate-pulse">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-3 w-3 text-blue-400" />
                            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter">AI Suggestion</p>
                          </div>
                          <p className="text-xs text-white/80 leading-relaxed font-mono">
                            Detected 2h gap today at 2 PM. Schedule "Sprint Review" to maintain high tactical momentum?
                          </p>
                          <Button variant="link" className="p-0 h-auto text-[10px] text-blue-400 mt-2 hover:text-blue-300">
                            Auto-Schedule →
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-auto p-6 border-t border-white/10">
                      <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-500 text-white">
                        <MessageSquare className="h-4 w-4" />
                        Chat Assistant
                      </Button>
                    </div>
                  </aside>
                </>
              ) : (
                <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="p-4 rounded-full bg-white/5 border border-white/10">
                    {currentView === 'Insights' ? <Sparkles className="h-12 w-12 text-blue-400" /> : <Settings className="h-12 w-12 text-blue-400" />}
                  </div>
                  <h2 className="text-3xl font-bold text-white uppercase tracking-tighter">
                    {currentView} Component
                  </h2>
                  <p className="text-white/40 max-w-md">
                    Tactical parameters and data visualization for {currentView} are currently being synthesized.
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </ErrorBoundary>
  );
}
