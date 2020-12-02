import type { Request, Response } from 'express';
import fs from 'promise-fs';
import path from 'path';
import { getJsonFileNameFromSitemap, cleanString } from '../helpers';
import { BRANCH_NOT_FOUND_ERROR, FILE_NOT_FOUND_ERROR } from '../constants';

export function get(req: Request, res: Response) {
  let pathToSitemap = path.join('content', 'sitemap.json');
  fs.readFile(pathToSitemap)
    .then(data => {
      let json = JSON.parse(data.toString());

      return json;
    })
    .then((sitemap) => {
      let url = req.path.replace(/.json$/, '').replace('index', '');
      let jsonFileName = getJsonFileNameFromSitemap(url, sitemap);
      let pathToJson = path.join('content', jsonFileName);
      return fs.readFile(pathToJson, { encoding: 'utf-8' });
    })
    .then(data => {
      let pageJson = JSON.parse(cleanString(data.toString()));
      res.json(pageJson);
    })
    .catch(err => {
      if (err.message === BRANCH_NOT_FOUND_ERROR || err.message === FILE_NOT_FOUND_ERROR) {
        console.log('Page content does not exist');
        res.status(404).json({ error: 'Page content does not exist' });
        return;
      }

      console.log('Error getting page json', err);
      res.status(500).json({ error: 'Error getting page json' });
    })
}