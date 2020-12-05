import type { RequestWithSession } from '../../types';
import type { Response } from 'express';
import getFileFromGithubWithHash from './_getFileFromGithubWithHash';
import createOrUpdateFileOnGithubWithHash from './_createOrUpdateFileOnGithubWithHash';

export function post(req: RequestWithSession, res: Response) {
  // Todo use environment variable

  const { githubUsername, githubToken, email, author } = req.session;

  let vercelJsonPath = 'vercel.json'
  let vercelJson: any;

  getFileFromGithubWithHash({
    owner: githubUsername,
    repo: process.env.GITHUB_REPO,
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
        repo: process.env.GITHUB_REPO,
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
        repo: process.env.GITHUB_REPO,
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