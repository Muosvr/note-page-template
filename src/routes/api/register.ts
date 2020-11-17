import { User } from '../../models';
// import axios from 'axios';
// import { Octokit } from '@octokit/rest';


export function post(req, res) {
  let username: string = req.body.username;
  let password: string = req.body.password;

  let user = new User({ username, password })
  user.save(function (error, newUser){
    if (error) {
      res.status(500).json({ success: false, error })
    }else{
      req.session.username = newUser.username;
      req.session.userId = newUser.id;
      res.json({ user: newUser, success: true })
    }
  });
}