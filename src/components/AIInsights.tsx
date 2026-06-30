import { Sparkles, MessageSquare } from "lucide-react";
import { Button } from "../../components/ui/button";

export function AIInsights() {
  return (
    <aside className="w-[280px] border-l border-white/10 glass-dark flex flex-col shrink-0">
      <div className="p-6">
        <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
          AI Insights
        </h3>
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs text-white/60 mb-1">Energy Peak</p>
            <p className="text-lg font-bold text-blue-400">
              08:00 AM - 11:30 AM
            </p>
          </div>
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 animate-pulse">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-3 w-3 text-blue-400" />
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter">
                AI Suggestion
              </p>
            </div>
            <p className="text-xs text-white/80 leading-relaxed font-mono">
              Detected 2h gap today at 2 PM. Schedule "Sprint Review" to
              maintain high tactical momentum?
            </p>
            <Button
              variant="link"
              className="p-0 h-auto text-[10px] text-blue-400 mt-2 hover:text-blue-300"
            >
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
  );
}
