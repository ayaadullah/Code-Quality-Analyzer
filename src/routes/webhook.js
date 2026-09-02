import crypto from 'node:crypto';
import express from 'express';
import { config } from '../config.js';
import { reviewPullRequest } from '../services/reviewer.js';

export const webhookRouter = express.Router();

function verifySignature(rawBody, signature) {
  if (!signature?.startsWith('sha256=')) return false;

  const expected = `sha256=${crypto
    .createHmac('sha256', config.githubWebhookSecret)
    .update(rawBody)
    .digest('hex')}`;

  const expectedBuffer = Buffer.from(expected, 'utf8');
  const signatureBuffer = Buffer.from(signature, 'utf8');

  return expectedBuffer.length === signatureBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
}

webhookRouter.post('/github', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.header('x-hub-signature-256');

  if (!verifySignature(req.body, signature)) {
    return res.status(401).json({ error: 'Invalid webhook signature' });
  }

  const event = req.header('x-github-event');
  const payload = JSON.parse(req.body.toString('utf8'));

  if (event !== 'pull_request' || !['opened', 'synchronize', 'reopened'].includes(payload.action)) {
    return res.status(200).json({ received: true, ignored: true });
  }

  const owner = payload.repository?.owner?.login;
  const repo = payload.repository?.name;
  const pullNumber = payload.number;

  if (!owner || !repo || !pullNumber) {
    return res.status(400).json({ error: 'Invalid pull request payload' });
  }

  res.status(202).json({ received: true });

  try {
    await reviewPullRequest({ owner, repo, pullNumber });
  } catch (error) {
    console.error('Pull request review failed:', error);
  }
});
