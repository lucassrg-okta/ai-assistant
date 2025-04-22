import { userInfoTool } from './user-info';
import { googleCalendarViewTool } from './google-calendar-view';
import { calendarCreateAsyncTool } from './google-calendar-ciba';
import type { SessionData } from '@auth0/nextjs-auth0/types';

export function getToolsForUser(session: SessionData | null) {
  return {
    userInfo: userInfoTool,
    calendarView: googleCalendarViewTool,
    calendarCreate: session?.user?.sub ? calendarCreateAsyncTool(session.user.sub) : undefined,
  };
};