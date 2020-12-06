import type { RequestWithSession } from '../../types';
import type { Response } from 'express';

export function get(req: RequestWithSession, res: Response) {
  req.session.username = '';
  res.redirect(302, '/');
}