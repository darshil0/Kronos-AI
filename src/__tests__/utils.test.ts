// src/__tests__/utils.test.ts
import { describe, it, expect } from 'vitest';
import { validateEmail, sanitizeInput, generateAIFeedbackPrompt } from '../lib/feedbackUtils';

describe('Feedback Utilities', () => {
  describe('validateEmail', () => {
    it('should return true for valid emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(validateEmail('plainaddress')).toBe(false);
      expect(validateEmail('@missinguser.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should trim surrounding whitespace', () => {
      expect(sanitizeInput('  hello world  ')).toBe('hello world');
    });

    it('should collapse multiple internal spaces into one', () => {
      expect(sanitizeInput('hello     world')).toBe('hello world');
    });
  });

  describe('generateAIFeedbackPrompt', () => {
    it('should generate a correctly formatted prompt', () => {
      const subject = 'Bug Report';
      const message = 'Calendar is lagging.';
      const prompt = generateAIFeedbackPrompt(subject, message);
      
      expect(prompt).toContain('Subject: Bug Report');
      expect(prompt).toContain('Message: Calendar is lagging.');
      expect(prompt).toContain('analysis and categorize');
    });
  });
});
