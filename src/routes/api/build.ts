import type { RequestWithSession } from '../../types';
import type { Response } from 'express';
import getFileFromGithubWithHash from './_getFileFromGithubWithHash';
import createOrUpdateFileOnGithubWithHash from './_createOrUpdateFileOnGithubWithHash';

export function post(req: RequestWithSession, res: Response) {
  const githubUsername = process.env.GITHUB_USERNAME;
  const githubToken = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const author = process.env.AUTHOR;
  const email = process.env.EMAIL;

  let vercelJsonPath = 'vercel.json'
  let vercelJson: any;

  getFileFromGithubWithHash({
    owner: githubUsername,
    repo,
    token: githubToken,
    path: vercelJsonPath
  })
    .then(({ file: vercelJsonRes, sha }) => {
      vercelJsonRes.github = {
        enabled: true
      }
      vercelJson = vercelJsonRes;
      return createOrUpdateFileOnGithubWithHash({
        content: vercelJsonRes,
        owner: githubUsername,
        repo,
        email,
        token: githubToken,
        path: vercelJsonPath,
        name: author,
        sha
      })
    })
    .then((value: any) => {
      let sha = value.data.content.sha;
      vercelJson.github = {
        enabled: false
      }
      return createOrUpdateFileOnGithubWithHash({
        content: vercelJson,
        owner: githubUsername,
        repo,
        email,
        token: githubToken,
        path: vercelJsonPath,
        name: author,
        sha
      })
    })
    .then(() => res.json({ success: true }))
    .catch(err => {
      res.status(500).json({ error: err })
    })
}