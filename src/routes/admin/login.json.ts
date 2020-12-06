import type { RequestWithSession } from '../../types';
import type { Response } from 'express';
import { toAllCapSnakeCase } from '../../helpers';

export function post(req: RequestWithSession, res: Response) {
  const { username, password } = req.body;
  const passwordName = toAllCapSnakeCase(`${username}_password`)
  if (process.env[passwordName] === password) {
    req.session.username = username;
    res.json({ username });
    return;
  }

  delete req.session.username;
  res.status(403).json({ error: 'Invalid credentials' })
}