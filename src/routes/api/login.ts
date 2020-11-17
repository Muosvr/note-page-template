// import axios from 'axios';
import { User } from '../../models';

export function post(req, res) {
  let username: string = req.body.username;
  let password: string = req.body.password;

  User.findOne({username})
  .then(user => {
    if (!user || !validatePassword(password, user.password)) {
      res.status(403).json({error: 'Invalid credentials'});
      return;
    }
    console.log('user', user);
    req.session.userId = user.id;
    req.session.name = user.username;
    req.session.touch(req.session.id, req.session, (err) => console.log('Error touching session'))
    res.json({ user }) 
  })
}

function validatePassword(password: string, record: string): boolean {
  if (password === record) {
    return true;
  }else {
    return false
  }
}