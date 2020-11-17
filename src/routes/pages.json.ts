import { Page, User } from '../models';

export function get(req, res) {
  let userId = process.env.USER_ID || req.session.userId;
  User.findOne({ _id: userId })
    .then(user => {
      if (!user){
        res.status(404).send('User not found');
        return;
      }
      let query: {owner: string, published?: boolean } = { owner: user.id }

      if (process.env.PUBLISHED_ONLY){
        query = {...query, published: true}
      }

      Page.find(query)
      .then(pages => res.json(pages))
      .catch(() => res.status(500).json({error: 'Unable to retrieve pages'}))

    })
}