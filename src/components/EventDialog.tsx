import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { CalendarEvent, Persona, EventType, EventStatus } from '../types';
import { calendarService } from '../services/calendarService';
import { toast } from 'sonner';
import { Trash2, Save, Plus } from 'lucide-react';
import { format, addHours } from 'date-fns';
import { useAuth } from '../context/AuthContext';

interface EventDialogProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: Date;
}

export function EventDialog({ event, isOpen, onClose, defaultDate }: EventDialogProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Partial<CalendarEvent>>({
    title: '',
    description: '',
    persona: 'work',
    type: 'task',
    status: 'confirmed',
    start_time: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    end_time: format(addHours(new Date(), 1), "yyyy-MM-dd'T'HH:mm"),
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || '',
        start_time: format(new Date(event.start_time), "yyyy-MM-dd'T'HH:mm"),
        end_time: format(new Date(event.end_time), "yyyy-MM-dd'T'HH:mm"),
        persona: event.persona,
        type: event.type,
        status: event.status,
      });
    } else {
      const baseDate = defaultDate || new Date();
      setFormData({
        title: '',
        description: '',
        persona: 'work',
        type: 'task',
        status: 'confirmed',
        start_time: format(baseDate, "yyyy-MM-dd'T'HH:mm"),
        end_time: format(addHours(baseDate, 1), "yyyy-MM-dd'T'HH:mm"),
      });
    }
  }, [event, isOpen, defaultDate]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    const toastId = toast.loading(event ? 'Updating tactical parameters...' : 'Synthesizing new event...');
    try {
      if (event) {
        await calendarService.updateEvent(event.id, {
          ...formData,
          start_time: new Date(formData.start_time!).toISOString(),
          end_time: new Date(formData.end_time!).toISOString(),
        });
        toast.success('Mission parameters updated.', { id: toastId });
      } else {
        await calendarService.addEvent({
          user_id: user.uid,
          title: formData.title || 'Untitled Mission',
          description: formData.description,
          start_time: new Date(formData.start_time!).toISOString(),
          end_time: new Date(formData.end_time!).toISOString(),
          persona: formData.persona as Persona,
          type: formData.type as EventType,
          status: formData.status as EventStatus,
          priority: 5,
          energy_score: 5,
          action_items: []
        });
        toast.success('New mission tactical data synchronized.', { id: toastId });
      }
      onClose();
    } catch (error) {
      toast.error('Mission failed.', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const isInvalid = formData.start_time && formData.end_time && new Date(formData.end_time) <= new Date(formData.start_time);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to terminate this event?')) return;
    
    const toastId = toast.loading('Terminating event...');
    try {
      await calendarService.deleteEvent(event.id);
      toast.success('Event terminated.', { id: toastId });
      onClose();
    } catch (error) {
      toast.error('Termination failed.', { id: toastId });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px] glass-dark border-white/10 text-white p-0 overflow-hidden">
        <DialogHeader className="p-6 bg-white/5 border-b border-white/10">
          <DialogTitle className="text-xl font-bold font-mono tracking-tight uppercase">
            {event ? 'Event Intel: ' : 'New Mission Strategy'} 
            {event && <span className="text-blue-400">{event.title}</span>}
          </DialogTitle>
          <DialogDescription className="text-white/40 font-mono text-xs">
            Refine parameters for optimal tactical alignment.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs uppercase tracking-widest text-white/60">Title</Label>
            <Input 
              id="title" 
              value={formData.title || ''} 
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-white/5 border-white/10 focus:ring-blue-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time" className="text-xs uppercase tracking-widest text-white/60">Start Time</Label>
              <Input 
                id="start_time" 
                type="datetime-local"
                value={formData.start_time || ''} 
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                className="bg-white/5 border-white/10 focus:ring-blue-500/50 [color-scheme:dark]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_time" className="text-xs uppercase tracking-widest text-white/60">End Time</Label>
              <Input 
                id="end_time" 
                type="datetime-local"
                value={formData.end_time || ''} 
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                className="bg-white/5 border-white/10 focus:ring-blue-500/50 [color-scheme:dark]"
              />
            </div>
          </div>

          {isInvalid && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3 flex items-center gap-3 text-red-400 text-xs font-mono animate-in fade-in slide-in-from-top-1">
              <span className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-red-500/20 font-bold">!</span>
              Temporal Paradox Detected: End time must occur after start time.
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
             <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest text-white/60">Persona</Label>
              <select 
                value={formData.persona}
                onChange={(e) => setFormData({ ...formData, persona: e.target.value as Persona })}
                className="w-full bg-white/5 border border-white/10 rounded-md p-2 text-sm focus:ring-blue-500/50 outline-none"
              >
                <option value="work">Work</option>
                <option value="family">Family</option>
                <option value="side">Side Project</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest text-white/60">Type</Label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as EventType })}
                className="w-full bg-white/5 border border-white/10 rounded-md p-2 text-sm focus:ring-blue-500/50 outline-none"
              >
                <option value="meeting">Meeting</option>
                <option value="task">Task</option>
                <option value="deep_work">Deep Work</option>
                <option value="admin">Admin</option>
                <option value="travel">Travel</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest text-white/60">Status</Label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as EventStatus })}
                className="w-full bg-white/5 border border-white/10 rounded-md p-2 text-sm focus:ring-blue-500/50 outline-none"
              >
                <option value="confirmed">Confirmed</option>
                <option value="proposed">Proposed</option>
                <option value="ghost">Ghost</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs uppercase tracking-widest text-white/60">Description</Label>
            <Textarea 
              id="description" 
              value={formData.description || ''} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-white/5 border-white/10 focus:ring-blue-500/50 min-h-[100px]"
              placeholder="Operational objectives and context..."
            />
          </div>
        </div>

        <DialogFooter className="p-6 bg-white/5 border-t border-white/10 flex items-center justify-between gap-4">
          {event && (
            <Button 
              variant="ghost" 
              onClick={handleDelete}
              className="text-red-400 hover:bg-red-400/10 hover:text-red-300 gap-2 font-mono text-xs uppercase"
            >
              <Trash2 className="h-4 w-4" />
              Terminate
            </Button>
          )}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="border-white/10 hover:bg-white/5 font-mono text-xs uppercase"
            >
              Abort
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving || isInvalid || !formData.title}
              className={cn(
                "bg-blue-600 hover:bg-blue-500 text-white gap-2 font-mono text-xs uppercase tracking-widest px-6",
                isInvalid && "opacity-50 grayscale cursor-not-allowed"
              )}
            >
              {isSaving ? 'Synchronizing...' : (event ? 'Update Parameters' : 'Authorize Mission')}
              {event ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
