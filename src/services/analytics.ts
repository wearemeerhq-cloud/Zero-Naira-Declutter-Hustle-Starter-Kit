import { AnalyticsEventType } from '../types';

export const trackEvent = async (event: AnalyticsEventType, params?: Record<string, unknown>) => {
  try {
    console.log(`[Analytics] ${event}`, params || {});
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, params, timestamp: new Date().toISOString() })
    });
  } catch (e) {
    // Silent fail for analytics
  }
};
