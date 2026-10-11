import { tool } from '@openai/agents';
import { z } from 'zod';
import { callDemoService } from './demo-service.js';

export const check_service_health = tool({
  name: 'check_service_health',
  description: 'Check if the service is up and what components are failing (database, payment service, memory). Always call this first.',
  parameters: z.object({}),
  async execute() {
    const health = await callDemoService('/health');
    const products = await callDemoService('/products');
    return { health, products };
  },
});

export const get_recent_logs = tool({
  name: 'get_recent_logs',
  description: 'Read recent service logs to find errors and warnings. Call this when health check shows a problem.',
  parameters: z.object({}),
  async execute() {
    const result = await callDemoService('/logs');
    if (!result.body?.logs) return result;
    return result.body.logs.map((line) => ({ ...line, message: line.message.slice(0, 200) }));
  },
});

export const get_production_info = tool({
  name: 'get_production_info',
  description: 'Get service version, configuration (db host, payment URL), and performance metrics (latency, error rate). Call this to confirm the root cause.',
  parameters: z.object({}),
  async execute() {
    const version = await callDemoService('/version');
    const metrics = await callDemoService('/metrics');
    return { version: version.body, metrics: metrics.body };
  },
});
