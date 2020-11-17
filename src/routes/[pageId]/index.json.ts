import fs from 'fs';
import path from 'path';

export function get(req, res) {
  const pageId: string = req.params.pageId;
  let userId = process.env.USER_ID || req.session.userId;

  let query: { pageId: string, owner: string, published?: boolean } = { pageId, owner: userId }

  if (process.env.PUBLISHED_ONLY){
    query = { ...query, published: true}
  }
  let pathToJson = path.join('content', `${pageId}.json`);
  fs.readFile(pathToJson, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT'){
        res.status(403).json({error: 'Page content does not exist'});
        return;
      }
      
      res.status(500).json({error: err});
      return;
    }
    let dataStr = data.toString();
    let pageJson = JSON.parse(dataStr);
    res.json(pageJson);
  })
}