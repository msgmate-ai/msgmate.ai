interface AnalyticsEvent {
  id: string;
  timestamp: Date;
  type: 'signup' | 'email_verification' | 'message_generated' | 'tone_selection' | 'subscription_upgrade' | 'message_decoder' | 'message_coach' | 'conversation_starter';
  userId?: number;
  userEmail?: string;
  data?: any;
}

// In-memory store for events (development only)
let events: AnalyticsEvent[] = [];
const MAX_EVENTS = 1000; // Keep only last 1000 events

function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function logEvent(type: AnalyticsEvent['type'], userId?: number, userEmail?: string, data?: any): void {
  // Only log events in development
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  const event: AnalyticsEvent = {
    id: generateEventId(),
    timestamp: new Date(),
    type,
    userId,
    userEmail,
    data
  };

  events.unshift(event);
  
  // Keep only the most recent events
  if (events.length > MAX_EVENTS) {
    events = events.slice(0, MAX_EVENTS);
  }

  console.log(`📊 Analytics: ${type}`, { userId, userEmail, data });
}

export function getEvents(limit = 100): AnalyticsEvent[] {
  return events.slice(0, limit);
}

export function getEventStats() {
  const stats = {
    total: events.length,
    byType: {} as Record<string, number>,
    recentActivity: events.slice(0, 10)
  };

  events.forEach(event => {
    stats.byType[event.type] = (stats.byType[event.type] || 0) + 1;
  });

  return stats;
}

export function clearEvents(): void {
  events = [];
}