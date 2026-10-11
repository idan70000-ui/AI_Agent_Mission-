import { Agent, setDefaultOpenAIKey } from '@openai/agents';
import { check_service_health, get_recent_logs, get_production_info } from './tools.js';
setDefaultOpenAIKey(process.env.OPENAI_API_KEY);

export const agent = new Agent({
  name: 'DevOps Agent',
  instructions: `אתה סוכן on-call שחוקר תקלות בשירות של חנות משקאות חריפים.

השתמש בכלים כדי לחקור:
1. check_service_health — בדוק את מצב השירות הכללי
2. get_recent_logs — בדוק לוגים אחרונים לשגיאות והתנהגות חריגה
3. get_production_info — בדוק קונפיגורציה ומטריקות

בסס את המסקנות שלך רק על ראיות מהכלים. אל תמציא מידע.

ענה בעברית עם בדיוק 4 חלקים:
מה נבדק:
ראיות:
השערה:
הצעד הבא:`,
  model: 'gpt-4o-mini',
  tools: [check_service_health, get_recent_logs, get_production_info],
});
