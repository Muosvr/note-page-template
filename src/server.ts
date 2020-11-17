import sirv from 'sirv';
import compression from 'compression';
import * as sapper from '@sapper/server';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import proxy from 'express-http-proxy';
import session from 'express-session';
import createStore from 'connect-mongo';
import csrf from 'csurf';

const SessionStore = createStore(session);

dotenv.config()

mongoose.connect(
	process.env.MONGO_URI,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true
	}
).then(
	() => console.log('MongoDB connected')
).catch(err => console.log('Failed to connect to DB.', err));

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';
const image_host = process.env.IMAGE_UPLOAD_HOST;
const upload_path_with_key = process.env.IMAGE_UPLOAD_PATH_WITH_CREDS;

const app = express();

const csrfProtection = csrf();

app.use('/api/upload', proxy(image_host, {
	proxyReqPathResolver: function (req) {
		return upload_path_with_key
	}
}))

app.use(session({
	secret: process.env.SESSION_SECRET,
	store: new SessionStore({ mongooseConnection: mongoose.connection}),
	resave: false,
	saveUninitialized: false
}));

app.use(bodyParser.json());

app.use(
	csrfProtection,
	compression({ threshold: 0 }),
	sirv('static', { dev }),
	sapper.middleware({
		session: (req, res) => ({
			csrf: req.csrfToken(),
			username: process.env.USERNAME || req.session.username,
			userId: process.env.USER_ID || req.session.userId,
		})
	})
);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

export default app