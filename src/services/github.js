import { Octokit } from '@octokit/rest';
import { config } from '../config.js';

const octokit = new Octokit({ auth: config.githubToken });

export async function getPullRequestDiff(owner, repo, pullNumber) {
  const response = await octokit.rest.pulls.get({
    owner,
    repo,
    pull_number: pullNumber,
    mediaType: { format: 'diff' }
  });

  return response.data;
}

export async function postPullRequestComment(owner, repo, pullNumber, body) {
  const response = await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: pullNumber,
    body
  });

  return response.data;
}
