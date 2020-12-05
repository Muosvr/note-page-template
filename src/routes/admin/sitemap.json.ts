import getFileFromGithub from '../api/_getFileFromGithub';
import createOrUpdateFileOnGithub from '../api/_createOrUpdateFileOnGithub';
import type { Response } from 'express';
import type { RequestWithSession } from '../../types';

const siteMapPath = 'content/sitemap.json';

export function get(req: RequestWithSession, res: Response) {

  getFileFromGithub({
    owner: process.env.GITHUB_USERNAME,
    repo: process.env.GITHUB_REPO,
    token: process.env.GITHUB_TOKEN,
    path: siteMapPath
  })
    .then(resp => res.json(resp))
    .catch(error => {
      res.status(error.status).json({ error })
    });
};

export function put(req: RequestWithSession, res: Response) {

  createOrUpdateFileOnGithub({
    content: req.body,
    path: siteMapPath,
    owner: process.env.GITHUB_USERNAME,
    repo: process.env.GITHUB_REPO,
    name: process.env.AUTHOR,
    email: process.env.EMAIL,
    token: process.env.GITHUB_TOKEN
  })
    .then(() => res.json({ success: true }))
    .catch(error => res.status(500).json({ error }));

};