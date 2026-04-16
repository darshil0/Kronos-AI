import React from 'react';
import { LayoutDashboard, Calendar as CalendarIcon, Zap, Users, Shield, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/button';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Separator } from '../../components/ui/separator';

const navigation = [
  { name: 'Today', icon: LayoutDashboard, current: true },
  { name: 'Calendar', icon: CalendarIcon, current: false },
  { name: 'Insights', icon: Zap, current: false },
  { name: 'Community', icon: Users, current: false },
];

const personas = [
  { name: 'Work', color: 'bg-[#60a5fa]' },
  { name: 'Family', color: 'bg-[#4ade80]' },
  { name: 'Side Project', color: 'bg-[#f59e0b]' },
];

export function Sidebar() {
  return (
    <div className="flex h-full w-[240px] flex-col glass-dark border-r border-white/10 text-white bg-zinc-900/30">
      <div className="flex h-16 shrink-0 items-center px-6 gap-2">
        <div className="w-6 h-6 bg-blue-500 rounded-md shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
        <h1 className="text-lg font-bold tracking-tight text-white">KRONOS AI</h1>
      </div>
      
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-4">
          <div className="py-2">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 text-white hover:bg-white/10",
                    item.current && "bg-white/10"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Button>
              ))}
            </div>
          </div>

          <Separator className="bg-white/10" />

          <div className="py-2">
            <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-white/40">
              Personas
            </h2>
            <div className="space-y-1">
              {personas.map((persona) => (
                <Button
                  key={persona.name}
                  variant="ghost"
                  className="w-full justify-start gap-3 text-white hover:bg-white/10"
                >
                  <div className={cn("h-2 w-2 rounded-full", persona.color)} />
                  {persona.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 mt-auto border-t border-white/10 space-y-2">
        <Button variant="default" className="w-full justify-start gap-3 bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold">
          <Shield className="h-4 w-4" />
          SHIELD MODE
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-3 text-white/60 hover:text-white hover:bg-white/10">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  );
}
