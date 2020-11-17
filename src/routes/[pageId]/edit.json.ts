import getPageContentFromGithub from '../api/_getPageContentFromGithub';
import updatePageContentOnGithub from '../api/_updatePageContentOnGithub';

export function get(req, res) {
  getPageContentFromGithub(req.params.pageId)
    .then(resp => res.json(resp))
    .catch(error => {
      res.status(error.status).json({ error })
    });
};

export function put(req, res) {
  updatePageContentOnGithub(req.body)
  .then(() => res.json({success: true}))
  .catch(error => res.status(500).json({ error }));

};