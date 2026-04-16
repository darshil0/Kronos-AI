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
import { Trash2, Save, X } from 'lucide-react';
import { format } from 'date-fns';

interface EventDialogProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EventDialog({ event, isOpen, onClose }: EventDialogProps) {
  const [formData, setFormData] = useState<Partial<CalendarEvent>>({});
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
    }
  }, [event]);

  if (!event) return null;

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading('Updating tactical parameters...');
    try {
      await calendarService.updateEvent(event.id, {
        ...formData,
        start_time: new Date(formData.start_time!).toISOString(),
        end_time: new Date(formData.end_time!).toISOString(),
      });
      toast.success('Mission parameters updated.', { id: toastId });
      onClose();
    } catch (error) {
      toast.error('Failed to update event.', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

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
            Event Intel: <span className="text-blue-400">{event.title}</span>
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
          <Button 
            variant="ghost" 
            onClick={handleDelete}
            className="text-red-400 hover:bg-red-400/10 hover:text-red-300 gap-2 font-mono text-xs uppercase"
          >
            <Trash2 className="h-4 w-4" />
            Terminate
          </Button>
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
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-500 text-white gap-2 font-mono text-xs uppercase tracking-widest px-6"
            >
              {isSaving ? 'Updating...' : 'Save Parameters'}
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
