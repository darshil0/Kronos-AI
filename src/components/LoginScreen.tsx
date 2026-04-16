import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Shield } from 'lucide-react';

export function LoginScreen() {
  const { signIn } = useAuth();

  return (
    <div className="flex h-screen w-full items-center justify-center p-6">
      <div className="glass-dark p-12 rounded-3xl border border-white/10 max-w-lg w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse" />
              <div className="relative w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.8)] border border-white/20 flex items-center justify-center">
                <Shield className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl font-extrabold tracking-tighter text-white">KRONOS AI</h1>
            <p className="text-white/60 text-lg">Your autonomous tactical calendar assistant.</p>
          </div>
        </div>
        
        <div className="py-4">
          <div className="h-0.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent mb-8" />
          <Button 
            onClick={signIn}
            className="w-full h-14 text-lg bg-white text-black hover:bg-white/90 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] font-semibold"
          >
            Authenticate with Google
          </Button>
        </div>
        
        <p className="text-xs text-white/30 px-8">
          By authenticating, you grant the Ultimate AI Calendar permission to autonomously resolve conflicts and optimize your schedule.
        </p>
      </div>
    </div>
  );
}
