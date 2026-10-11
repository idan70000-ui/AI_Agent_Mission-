import { run } from '@openai/agents';
import { agent } from '../../../lib/agent.js';
import { saveInvestigation } from '../../../lib/db.js';

export async function POST() {
  try {
    const result = await run(agent, 'חקור את השירות וזהה אם יש תקלה.');

    const report = {
      output: result.finalOutput,
      createdAt: new Date(),
    };

    await saveInvestigation(report);

    return Response.json(report);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
