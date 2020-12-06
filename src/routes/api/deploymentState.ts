import type { RequestWithSession } from "../../types";
import type { Response } from "express";
import axios from "axios";
import _ from "lodash";

export function get(req: RequestWithSession, res: Response) {
  if (!req.session.username) {
    res.status(403).json({ error: "Not permitted" });
    return;
  }
  const projectStateUrl = 'https://api.vercel.com/v5/now/deployments';
  const config = {
    headers: {
      'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`
    }
  }

  axios.get(projectStateUrl, config)
    .then(({ data: { deployments } }) => {
      res.json({ state: deployments[0].state })
    })
    .catch(err => {
      console.log("Unable to get project status", _.get(err, 'response.data', err));
      res.status(500).json({ error: "Unable to get project status" });
    })
}