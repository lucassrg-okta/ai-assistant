import { userInfo } from './user-info';
import { googleCalendarViewTool } from './google-calendar-view';
import { calendarCreateAsyncTool } from './google-calendar-ciba';
import { getCompetitiveInsightTool } from '@/lib/tools/get-competitive-insight';
import { getRetirementAdviceTool } from '@/lib/tools/get-retirement-advice';
import { acceptFinancialTermsTool } from '@/lib/tools/accept-financial-terms';

import type { SessionData } from '@auth0/nextjs-auth0/types';

export function getToolsForUser(session: SessionData | null, assistant?: string) {
  const tools = {
    userInfo: userInfo,
    calendarView: googleCalendarViewTool,
  };

  if (assistant === 'sales' && session?.user?.sub) {
    return {
      ...tools,
      calendarCreate: calendarCreateAsyncTool(session.user.sub),
      getCompetitiveInsight: getCompetitiveInsightTool(session.user),
      acceptFinancialTerms: acceptFinancialTermsTool(session.user),
    };
  }

  if (assistant === 'personal' && session?.user?.sub) {
    return {
      ...tools,
      calendarCreate: calendarCreateAsyncTool(session.user.sub),
      getRetirementAdvice: getRetirementAdviceTool(session.user),
      acceptFinancialTerms: acceptFinancialTermsTool(session.user),
    };
  }

  return tools;
}
