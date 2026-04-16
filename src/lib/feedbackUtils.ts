// src/lib/feedbackUtils.ts

/**
 * Validates an email address using a standard regex.
 */
export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Sanitizes input text by trimming and removing extra spaces.
 */
export function sanitizeInput(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}

/**
 * Generates an AI prompt header for summarizing feedback.
 */
export function generateAIFeedbackPrompt(subject: string, message: string): string {
  return `Please analyze and categorize the following user feedback. 
Subject: ${subject}
Message: ${message}
Task: Provide a 3-bullet summary of the core issue and sentiment.`;
}
