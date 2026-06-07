// src/components/UserFeedbackForm.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { validateEmail, sanitizeInput } from '../lib/feedbackUtils';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/card';
import { Label } from '../../components/ui/label';

export interface FeedbackFormData {
  email: string;
  subject: string;
  message: string;
}

export function UserFeedbackForm() {
  const [formData, setFormData] = useState<FeedbackFormData>({
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getUserEmail() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setFormData(prev => ({ ...prev, email: user.email! }));
      }
    }
    getUserEmail();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (!formData.subject.trim() || !formData.message.trim()) {
      setError('Subject and message are required.');
      setLoading(false);
      return;
    }

    try {
      const { error: dbError } = await supabase
        .from('feedback')
        .insert([{
          email: formData.email,
          subject: sanitizeInput(formData.subject),
          message: sanitizeInput(formData.message),
        }]);

      if (dbError) throw dbError;

      setSuccess(true);
      setFormData({ email: formData.email, subject: '', message: '' }); // Reset message but keep email
    } catch (err: any) {
      console.error('Feedback submission error:', err);
      const errorMessage = err?.message || 'Unknown error';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="max-w-md mx-auto glass shadow-none border-white/10">
        <CardHeader>
          <CardTitle className="text-green-400">Feedback Sent!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/70">Thank you for your feedback. Our team (and our robots) will review it shortly.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => setSuccess(false)} variant="outline">Send another</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto glass shadow-none border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Transmit Feedback</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit} noValidate>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/60">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-black/20 border-white/10 text-white"
              placeholder="operator@kronos.ai"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-white/60">Subject</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="bg-black/20 border-white/10 text-white"
              placeholder="e.g., Tactical Optimization suggestion"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message" className="text-white/60">Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="bg-black/20 border-white/10 text-white min-h-[120px]"
              placeholder="Detail your operational observations..."
              required
            />
          </div>
          {error && <p className="text-red-400 text-sm font-mono">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-widest uppercase text-xs"
          >
            {loading ? 'Transmitting...' : 'Submit Transmission'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
