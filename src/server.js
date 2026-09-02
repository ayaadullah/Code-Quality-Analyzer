import express from 'express';
import { config } from './config.js';
import { webhookRouter } from './routes/webhook.js';

const app = express();

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'code-quality-analyzer' });
});

app.use('/webhooks', webhookRouter);

app.use((error, _req, res, _next) => {
  console.error('Unhandled server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(config.port, () => {
  console.log(`Code Quality Analyzer listening on port ${config.port}`);
});
