// Simple Analytics System for MsgMate
import { apiRequest } from './queryClient';

export interface EventProps {
  [key: string]: string | number | boolean;
}

export async function logEvent(event: string, props: EventProps = {}): Promise<void> {
  try {
    await apiRequest('POST', '/api/log-event', { event, props });
  } catch (error) {
    // Silently fail analytics - don't break user experience
    console.error('Analytics logging failed:', error);
  }
}

// Pre-defined event types for type safety
export const AnalyticsEvents = {
  USER_SIGNED_UP: 'User_Signed_Up',
  USER_SUBSCRIBED: 'User_Subscribed',
  MESSAGE_SENT: 'Message_Sent',
  CONVERSATION_STARTED: 'Conversation_Started',
  MESSAGE_COACH_USED: 'Message_Coach_Used',
  MESSAGE_DECODED: 'Message_Decoded',
  EMAIL_VERIFIED: 'Email_Verified',
  LOGIN_SUCCESS: 'Login_Success',
  SUBSCRIPTION_CANCELLED: 'Subscription_Cancelled',
} as const;