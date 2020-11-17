import { Page, User } from '../models';

export function get(req, res) {
  let username = req.params.username;
  console.log('json username', username);
  User.findOne({ username })
    .then(user => {
      if (!user){
        res.status(404).json({error: 'User not found'});
        return;
      }
      let query: any = { owner: user.username }

      if (!(req.session.username === username)){
        query = {...query, published: true}
      }

      Page.find(query)
      .then(pages => res.json(pages))
      .catch(() => res.status(500).json({error: 'Unable to retrieve pages'}))

    })
}