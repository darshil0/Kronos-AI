import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { CalendarEvent } from '../types';
import { Badge } from './ui/badge';
import { cn } from '../lib/utils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { EventDialog } from './EventDialog';

export function CalendarGrid() {
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'events'),
      where('user_id', '==', user.uid),
      orderBy('start_time', 'asc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const eventData = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as CalendarEvent[];
        setEvents(eventData);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'events');
      }
    );

    return () => unsubscribe();
  }, [user]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <div className="flex-1 p-5 overflow-auto bg-black/10">
      <div className="h-full bg-zinc-900/70 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/2">
          <h2 className="text-xl font-bold text-white">{format(currentDate, 'MMMM yyyy')}</h2>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-blue-400 border-blue-400/30 bg-blue-400/10">Work</Badge>
            <Badge variant="outline" className="text-green-400 border-green-400/30 bg-green-400/10">Family</Badge>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-white/10 bg-white/2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-4 text-center text-xs font-semibold uppercase tracking-wider text-white/40">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 flex-1">
          {days.map((day, i) => {
            const dayEvents = events.filter(e => isSameDay(new Date(e.start_time), day));
            return (
              <div
                key={i}
                className="border-r border-b border-white/10 p-2 hover:bg-white/5 transition-colors group cursor-pointer min-h-[120px]"
              >
                <span className="text-xs text-white/30 group-hover:text-white/80 transition-colors font-mono">
                  {format(day, 'd')}
                </span>
                <div className="mt-2 space-y-1">
                  {dayEvents.map(event => (
                    <div 
                      key={event.id}
                      onClick={() => {
                        setSelectedEvent(event);
                        setIsDialogOpen(true);
                      }}
                      className={cn(
                        "px-2 py-2 rounded-md text-[10px] font-semibold truncate border-l-4 backdrop-blur-sm shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all",
                        event.persona === 'work' ? "bg-blue-500/15 text-blue-300 border-blue-400" :
                        event.persona === 'family' ? "bg-green-500/15 text-green-300 border-green-400" :
                        "bg-amber-500/15 text-amber-300 border-amber-500"
                      )}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <EventDialog 
        event={selectedEvent} 
        isOpen={isDialogOpen} 
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedEvent(null);
        }} 
      />
    </div>
  );
}
