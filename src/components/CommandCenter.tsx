import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { parseSchedulingPrompt } from '../services/geminiService';
import { calendarService } from '../services/calendarService';
import { useAuth } from '../AuthContext';
import { toast } from 'sonner';
import { addMinutes } from 'date-fns';

export function CommandCenter() {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !user) return;

    setIsProcessing(true);
    const id = toast.loading('KRONOS AI is calculating priority/persona alignments...', {
      className: 'glass border-white/10 text-white font-mono uppercase text-xs tracking-widest'
    });

    try {
      const parsed = await parseSchedulingPrompt(prompt);
      
      const startTime = new Date(parsed.start_time);
      const endTime = addMinutes(startTime, parsed.duration_minutes || 60);

      await calendarService.addEvent({
        user_id: user.uid,
        title: parsed.title,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        persona: parsed.persona || 'work',
        priority: parsed.priority || 5,
        type: parsed.type || 'meeting',
        status: 'confirmed',
        energy_score: 7, // Default for now
        action_items: parsed.action_items || []
      });

      toast.success(`Mission Success: "${parsed.title}" scheduled for ${startTime.toLocaleString()}`, {
        id,
        className: 'bg-green-500/20 text-green-400 border-green-500/30'
      });
      setPrompt('');
    } catch (error) {
      console.error('Command center error:', error);
      toast.error('Mission Failed: AI was unable to parse the tactical request.', { id });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleCommand} className="relative w-full max-w-2xl group">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {isProcessing ? (
          <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4 text-white/40 group-focus-within:text-blue-400 transition-colors" />
        )}
      </div>
      <Input 
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={isProcessing}
        placeholder="Autonomous Command: 'Sync with Team tomorrow at 10am'..." 
        className="pl-12 pr-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-blue-500/50 rounded-xl font-mono text-sm tracking-tight transition-all"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-white/40 opacity-100 uppercase">
          Enter
        </kbd>
      </div>
    </form>
  );
}
