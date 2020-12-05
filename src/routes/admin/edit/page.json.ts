import getFileFromGithub from '../../api/_getFileFromGithub';
import createOrUpdateFileOnGithub from '../../api/_createOrUpdateFileOnGithub';
import type { Response } from 'express';
import type { RequestWithSession, Sitemap } from '../../../types';
import { getJsonFileNameFromSitemap, createOrUpdateBranchInSitemap, cleanString } from '../../../helpers';
import { v4 as uuid } from 'uuid';
import { BRANCH_NOT_FOUND_ERROR, FILE_NOT_FOUND_ERROR } from '../../../constants';

const siteMapPath = 'content/sitemap.json';

export function get(req: RequestWithSession, res: Response) {
  const githubUsername = process.env.GITHUB_USERNAME;
  const githubToken = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;

  let pagePath = req.query.pagePath as string;

  // Todo: cache sitemap?
  getFileFromGithub({
    owner: githubUsername,
    repo,
    token: githubToken,
    path: siteMapPath,
  })
    .then((sitemapResp) => {
      let pathToJson = `content/${getJsonFileNameFromSitemap(pagePath, sitemapResp)}`;
      return getFileFromGithub({
        owner: githubUsername,
        repo,
        token: githubToken,
        path: pathToJson
      })
    })
    .then(pageJsonRes => {
      res.json(pageJsonRes);
    })
    .catch(error => {
      if (error.message === BRANCH_NOT_FOUND_ERROR || error.message === FILE_NOT_FOUND_ERROR) {
        res.status(404).json({ error })
        return;
      }
      res.status(error.status || 500).json({ error })
    });
};

export function put(req: RequestWithSession, res: Response) {
  const githubUsername = process.env.GITHUB_USERNAME;
  const githubToken = process.env.GITHUB_TOKEN;
  const author = process.env.AUTHOR;
  const email = process.env.EMAIL;
  const repo = process.env.GITHUB_REPO;

  let pagePath = req.query.pagePath as string;
  let pageName = req.query.pageName as string;

  const siteMapPath = 'content/sitemap.json';
  let pathToJson: string;
  let sitemap: Sitemap;

  // Todo: fix issue with concurrent requests here. (use github file hash)
  getFileFromGithub({
    owner: githubUsername,
    repo,
    token: githubToken,
    path: siteMapPath,
  })
    .then((sitemapResp: Sitemap) => {
      try {
        pathToJson = `content/${getJsonFileNameFromSitemap(pagePath, sitemapResp)}`;
        sitemap = sitemapResp;
      } catch (err) {
        if (err.message === BRANCH_NOT_FOUND_ERROR || err.message === FILE_NOT_FOUND_ERROR) {
          let newJsonFileName = `${uuid()}.json`;
          pathToJson = `content/${newJsonFileName}`;
          let branchUpdate: { '$jsonFile'?: string, '$name'?: string } = { '$jsonFile': newJsonFileName };
          if (pageName) {
            branchUpdate = { ...branchUpdate, '$name': pageName }
          }
          sitemap = createOrUpdateBranchInSitemap(pagePath, sitemapResp, branchUpdate);

          return createOrUpdateFileOnGithub({
            content: sitemap,
            owner: githubUsername,
            token: githubToken,
            email,
            repo,
            path: siteMapPath,
            name: author
          });
        } else {
          throw err;
        }
      }
    })
    .then(() => {
      let cleaned = JSON.parse(cleanString(JSON.stringify(req.body)));
      return createOrUpdateFileOnGithub({
        content: cleaned,
        owner: githubUsername,
        repo: process.env.GITHUB_REPO,
        name: author,
        email,
        token: githubToken,
        path: pathToJson
      })
    })
    .then(() => res.json({ success: true }))
    .catch(error => res.status(500).json({ error }));
};