import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const PORT = 3010;
const SCENARIO = process.env.SCENARIO || 'db_down';
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(express.static(join(__dirname, 'public')));


const logs = [];

function addLog(level, message) {
  logs.push({
    timestamp: new Date().toISOString(),
    level,
    message,
  });
}

addLog('info', 'Service starting up...');

if (SCENARIO === 'db_down') {
  addLog('error', 'Database connection failed: ECONNREFUSED db.internal:5432');
  addLog('warn', 'Running in degraded mode - database unavailable');
} else if (SCENARIO === 'payment_service_down') {
  addLog('info', 'Database connected successfully');
  addLog('error', 'Payment service unreachable: payments.external.com timeout after 5000ms');
  addLog('warn', 'Payment processing disabled');
} else if (SCENARIO === 'slow_response') {
  addLog('info', 'Database connected successfully');
  addLog('warn', 'High memory usage detected: 87% heap utilization');
  addLog('warn', 'Response times elevated - P95 latency: 4800ms');
} else {
  addLog('info', 'Database connected successfully');
  addLog('info', 'All systems healthy');
}


app.get('/health', (req, res) => {
  if (SCENARIO === 'db_down') {
    return res.status(503).json({
      status: 'degraded',
      uptime: process.uptime(),
      checks: { api: 'ok', database: 'error' },
      errors: ['Database connection failed: ECONNREFUSED db.internal:5432'],
      timestamp: new Date().toISOString(),
    });
  }

  if (SCENARIO === 'payment_service_down') {
    return res.status(200).json({
      status: 'degraded',
      uptime: process.uptime(),
      checks: { api: 'ok', database: 'ok', payment_service: 'error' },
      errors: ['Payment service unreachable: payments.external.com timeout'],
      timestamp: new Date().toISOString(),
    });
  }

  if (SCENARIO === 'slow_response') {
    return res.status(200).json({
      status: 'degraded',
      uptime: process.uptime(),
      checks: { api: 'ok', database: 'ok', memory: 'warning' },
      warnings: ['High memory utilization: 87%', 'Elevated response latency'],
      timestamp: new Date().toISOString(),
    });
  }

  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    checks: { api: 'ok', database: 'ok' },
    timestamp: new Date().toISOString(),
  });
});

app.get('/logs', (req, res) => {
  const level = req.query.level || 'all';
  const lines = parseInt(req.query.lines) || 20;

  const filtered = level === 'all'
    ? logs
    : logs.filter(l => l.level === level);

  res.json({
    logs: filtered.slice(-lines),
    total: filtered.length,
  });
});

app.get('/metrics', (req, res) => {
  const base = {
    uptime: Math.round(process.uptime()),
    memory: {
      heapUsedMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      heapTotalMB: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
    },
    latency: { p50: 45, p95: 120, p99: 250 },
    requests: { total: 1000, errors: 0, successRate: '100%' },
  };

  if (SCENARIO === 'db_down') {
    base.requests.errors = 320;
    base.requests.successRate = '68%';
    base.latency.p95 = 520;
  }

  if (SCENARIO === 'slow_response') {
    base.memory.heapUsedMB = 440;
    base.latency = { p50: 2100, p95: 4800, p99: 7200 };
  }

  if (SCENARIO === 'payment_service_down') {
    base.requests.errors = 45;
    base.requests.successRate = '95%';
  }

  res.json(base);
});

const products = [
  { id: 1, name: 'Johnnie Walker Black', category: 'whisky', price: 180, stock: 24 },
  { id: 2, name: 'Absolut Vodka', category: 'vodka', price: 95, stock: 48 },
  { id: 3, name: 'Hendricks Gin', category: 'gin', price: 160, stock: 12 },
  { id: 4, name: 'Bacardi Rum', category: 'rum', price: 85, stock: 36 },
];

app.get('/products', (req, res) => {
  if (SCENARIO === 'db_down') {
    addLog('error', 'GET /products failed: database unavailable');
    return res.status(503).json({ error: 'Service unavailable: database connection failed' });
  }

  res.json({ products, total: products.length });
});

app.get('/version', (req, res) => {
  res.json({
    service: 'liquor-store-service',
    version: '1.2.3',
    environment: process.env.NODE_ENV || 'development',
    node: process.version,
    startedAt: new Date(Date.now() - process.uptime() * 1000).toISOString(),
    config: {
      port: PORT,
      dbHost: 'db.internal',
      paymentServiceUrl: 'https://payments.external.com/api/v2',
    },
  });
});


app.listen(PORT, () => {
  console.log(`Service running on port ${PORT} | scenario: ${SCENARIO}`);
});
