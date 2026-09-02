# Code Quality Analyzer

AI-powered GitHub pull request reviewer that analyzes code changes with Claude and posts an automated review comment back to the pull request.

## Overview

Code Quality Analyzer connects GitHub webhooks, the GitHub API, and Anthropic's Claude API into an automated code-review pipeline.

```text
Pull Request
     │
     ▼
GitHub Webhook
     │
     ▼
Node.js / Express
     │
     ▼
GitHub API ──► Fetch PR diff
     │
     ▼
Claude API
     │
     ▼
AI code-quality analysis
     │
     ▼
GitHub PR comment
```

GitHub's `pull_request` webhook provides pull-request activity and its payload includes the pull request number and repository information. The application verifies GitHub's HMAC SHA-256 webhook signature before processing supported events. citeturn0search0turn0search1

## Tech Stack

- Node.js 20+
- Express 5
- GitHub REST API via Octokit
- GitHub Webhooks
- Anthropic Claude API
- dotenv
- Pino-compatible structured logging foundation

## Features

- Automatic review when a PR is opened, reopened, or synchronized
- Secure webhook signature verification
- Pull request diff retrieval through GitHub
- Claude-powered review focused on correctness, security, reliability, maintainability, and performance
- Structured review output with severity levels
- Automatic PR conversation comment
- Health-check endpoint
- Environment-based secrets
- Minimal, modular service architecture

## Project Structure

```text
Code-Quality-Analyzer/
├── src/
│   ├── routes/
│   │   └── webhook.js
│   ├── services/
│   │   ├── claude.js
│   │   ├── github.js
│   │   └── reviewer.js
│   ├── config.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Environment Variables

Copy `.env.example` to `.env` and provide:

```env
PORT=3000
GITHUB_TOKEN=your_github_token
GITHUB_WEBHOOK_SECRET=replace_with_a_random_secret
ANTHROPIC_API_KEY=your_anthropic_api_key
CLAUDE_MODEL=claude-sonnet-4-5
```

Never commit real API keys, GitHub tokens, or webhook secrets.

## Local Development

```bash
npm install
npm run dev
```

Health endpoint:

```text
GET /health
```

Webhook endpoint:

```text
POST /webhooks/github
```

## GitHub Webhook Configuration

Create a repository webhook pointing to:

```text
https://YOUR-DOMAIN/webhooks/github
```

Configure the webhook to use the same secret as `GITHUB_WEBHOOK_SECRET` and subscribe to **Pull requests** events. GitHub requires repository ownership or admin access to create a repository webhook. citeturn0search7turn0search2

The application currently processes these pull request actions:

- `opened`
- `reopened`
- `synchronize`

## Review Pipeline

1. GitHub sends a signed `pull_request` webhook.
2. Express verifies the `X-Hub-Signature-256` header.
3. The service extracts repository owner, repository name, and PR number.
4. Octokit retrieves the PR diff.
5. Claude reviews the diff using a focused code-review prompt.
6. The generated Markdown review is posted as a PR conversation comment.

This architecture follows GitHub's documented webhook pattern of receiving an event on an external server and using the GitHub API to respond to it. citeturn0search6

## Roadmap

- [x] Node.js project foundation
- [x] GitHub webhook endpoint
- [x] Webhook signature verification
- [x] Pull request diff retrieval
- [x] Claude integration
- [x] Automated PR comments
- [ ] Inline file-level review comments
- [ ] Review deduplication
- [ ] Changed-file filtering
- [ ] Retry and queue system
- [ ] Persistent review history
- [ ] Docker deployment
- [ ] Automated tests
- [ ] GitHub App authentication
- [ ] CI/CD pipeline

## Security Notes

The service validates webhook signatures before accepting GitHub events and keeps credentials in environment variables. Production deployments should also use HTTPS, least-privilege GitHub permissions, request logging, rate limiting, and robust retry/error handling.

## License

This project is intended as a portfolio and learning project. Add a formal license when you decide how you want others to use the code.
