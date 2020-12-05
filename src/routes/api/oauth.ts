import { Octokit } from '@octokit/rest';
import type { Octokit as OctokitClassType } from '@octokit/rest';
import axios from 'axios';
import type { Response } from 'express';
import type { RequestWithSession } from '../../types';

export function get(req: RequestWithSession, res: Response) {

  const { code } = req.query;
  let next = req.query.next as string || '';

  //Prevent redirect to external sites
  if (next[0] !== '/') {
    next = '/';
  };

  const payload = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code,
  };

  const config = {
    headers: {
      Accept: 'application/json'
    }
  };

  let octokit: OctokitClassType;
  let access_token: string;
  let githubUsername: string;
  let author: string;

  axios.post('https://github.com/login/oauth/access_token', payload, config)
    .then(response => {
      access_token = response.data.access_token;

      octokit = new Octokit({
        auth: access_token
      });

      return octokit.users.getAuthenticated();
    })
    .then(value => {
      githubUsername = value.data.login.toLowerCase();
      author = value.data.name;
      return octokit.users.listEmailsForAuthenticated();

    })
    .then(emailRes => {
      req.session.email = emailRes.data[0].email;
      req.session.githubUsername = githubUsername;
      req.session.author = author;
      // Todo: encrypt this token;
      req.session.githubToken = access_token;
      res.redirect(302, next);
    })
    .catch(err => {
      console.log('Error authenticating with github', err);
      res.redirect(302, '/login');
    })
}