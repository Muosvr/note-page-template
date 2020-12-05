import sirv from 'sirv';
import compression from 'compression';
import * as sapper from '@sapper/server';
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import proxy from 'express-http-proxy';
import csrf from 'csurf';
import cookieSession from 'cookie-session';
import type { RequestWithSession } from './types';
import type { Response } from 'express';

dotenv.config()

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';
const image_host = process.env.IMAGE_UPLOAD_HOST;
const upload_path_with_key = process.env.IMAGE_UPLOAD_PATH_WITH_CREDS;

const app = express();

const csrfProtection = csrf();

app.use('/api/upload', proxy(image_host, {
	proxyReqPathResolver: function () {
		return upload_path_with_key
	}
}))

app.use(cookieSession({
	name: 'session',
	keys: [process.env.SESSION_KEY_1, process.env.SESSION_KEY_2],
	httpOnly: true,
}))

app.use(bodyParser.json());

app.use(
	csrfProtection,
	compression({ threshold: 0 }),
	sirv('static', { dev }),
	sapper.middleware({
		session: (req: RequestWithSession, _: Response) => {
			return {
				csrf: req.csrfToken(),
				githubUsername: req.session.githubUsername,
				githubClientId: process.env.GITHUB_CLIENT_ID,
				repo: req.session.repo || process.env.GITHUB_REPO,
				newRepoUrl: req.session.newRepoUrl,
				hasVercelToken: !!req.session.vercelToken,
				vercelProjectId: req.session.vercelProjectId,
				newSiteDomain: req.session.newSiteDomain,
			}
		}
	})
);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

export default app