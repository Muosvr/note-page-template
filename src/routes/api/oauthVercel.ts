import axios from 'axios';
import type { Response } from 'express';
import type { RequestWithSession } from '../../types';

export function get(req: RequestWithSession, res: Response) {

  const { code } = req.query;
  // let next = req.query.next as string || '';

  //Prevent redirect to external sites
  // if (next[0] !== '/') {
  //   next = '/';
  // };

  let redirect_uri: string;

  if (process.env.NODE_ENV === 'production') {
    redirect_uri = 'https://note-page-sapper.vercel.app/api/oauthVercel'
  } else {
    redirect_uri = 'http://localhost:3000/api/oauthVercel';
  }

  const payload = `client_id=${process.env.VERCEL_CLIENT_ID}&client_secret=${process.env.VERCEL_CLIENT_SECRET}&redirect_uri=${redirect_uri}&code=${code}`

  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  axios.post('https://api.vercel.com/v2/oauth/access_token', payload, config)
    .then(response => {
      console.log('response.data.access_token :>> ', response.data.access_token);
      req.session.vercelToken = response.data.access_token;
      res.redirect(302, '/builder');
    })
    .catch(err => {
      console.log('Error authenticating with Vercel', err);
      res.redirect(302, '/builder');
    })
}