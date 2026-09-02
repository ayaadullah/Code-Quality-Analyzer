import 'dotenv/config';

const required = ['GITHUB_TOKEN', 'GITHUB_WEBHOOK_SECRET', 'ANTHROPIC_API_KEY'];

for (const name of required) {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
}

export const config = {
  port: Number(process.env.PORT || 3000),
  githubToken: process.env.GITHUB_TOKEN,
  githubWebhookSecret: process.env.GITHUB_WEBHOOK_SECRET,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  claudeModel: process.env.CLAUDE_MODEL || 'claude-sonnet-4-5'
};
