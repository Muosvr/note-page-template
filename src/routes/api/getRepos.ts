import { Octokit } from '@octokit/rest'
import type { RequestWithSession } from '../../types';
import type { Response } from 'express';

export function get(req: RequestWithSession, res: Response) {
  const octokit = new Octokit({ auth: req.session.githubToken });

  const q = `user:${req.session.githubUsername} ${req.query.keyword} in:name`;
  octokit.search.repos({ q })
    .then(({ data }) => {
      res.json(data)
    })
    .catch(err => {
      console.log('Cannot get repos', err.response.data);
      res.status(500).json({ error: 'Cannot get repos' });
    })
}