import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config.js';

const anthropic = new Anthropic({ apiKey: config.anthropicApiKey });

const SYSTEM_PROMPT = `You are a senior software engineer performing a pull request review.
Review only the supplied diff. Identify concrete correctness, security, reliability, maintainability, and performance issues.
Do not invent issues. Prioritize actionable findings and explain why each matters.
Return Markdown with these sections:
## Summary
## Findings
For each finding include severity (Critical, High, Medium, or Low), file/context, issue, and recommendation.
## Positive Notes
If there are no meaningful issues, say so clearly.`;

export async function analyzeDiff(diff, metadata = {}) {
  const prompt = [
    `Repository: ${metadata.repository ?? 'unknown'}`,
    `Pull request: #${metadata.pullNumber ?? 'unknown'}`,
    '',
    'Pull request diff:',
    '```diff',
    diff,
    '```'
  ].join('\n');

  const response = await anthropic.messages.create({
    model: config.claudeModel,
    max_tokens: 3000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: prompt }]
  });

  return response.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('\n');
}
