import { analyzeDiff } from './claude.js';
import { getPullRequestDiff, postPullRequestComment } from './github.js';

export async function reviewPullRequest({ owner, repo, pullNumber }) {
  const diff = await getPullRequestDiff(owner, repo, pullNumber);

  if (!diff || diff.trim().length === 0) {
    return { skipped: true, reason: 'The pull request contains no reviewable diff.' };
  }

  const review = await analyzeDiff(diff, {
    repository: `${owner}/${repo}`,
    pullNumber
  });

  const body = [
    '## 🤖 AI Code Quality Review',
    '',
    review,
    '',
    '---',
    '*Review generated automatically by Code Quality Analyzer.*'
  ].join('\n');

  await postPullRequestComment(owner, repo, pullNumber, body);
  return { skipped: false };
}
