// src/lib/tools/registry.ts
import { userInfo } from './user-info';
import { googleCalendarViewTool } from './google-calendar-view';
import { calendarCreateAsyncTool } from './google-calendar-ciba';
// import { weatherTool } from './weather'; // (if you add more later)

import type { SessionData } from '@auth0/nextjs-auth0/types';

export function getToolsForUser(session: SessionData | null, assistant?: string) {
  const tools = {
    userInfo: userInfo,
    calendarView: googleCalendarViewTool,
  };

  // Add assistant-specific tools
  if (assistant === 'sales' && session?.user?.sub) {
    return {
      ...tools,
      calendarCreate: calendarCreateAsyncTool(session.user.sub),
    };
  }

  if (assistant === 'personal' && session?.user?.sub) {
    return {
      ...tools,
      calendarCreate: calendarCreateAsyncTool(session.user.sub),
      // weather: weatherTool(), // optionally add more for personal flows
    };
  }

  return tools;
}
