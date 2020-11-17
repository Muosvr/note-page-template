import { Octokit } from '@octokit/rest'
import axios from 'axios'
import bcrypt from 'bcrypt';
import { User } from '../../models';
import aesjs from 'aes-js';

export function get(req, res) {
  const { code } = req.query;
  // console.log('code', code);
  // console.log('aes key', process.env.AES_KEY.split(' '));

  const payload = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code,
  }
  // console.log('oauth.ts >> payload', payload);

  const config = {
    headers: {
      Accept: 'application/json'
    }
  }

  axios.post('https://github.com/login/oauth/access_token', payload, config ).then(response => {
    // console.log('github auth response', response.data);
    let access_token = response.data.access_token;
    const octokit = new Octokit({
      auth: access_token
    });
    octokit.users.getAuthenticated()
      .then(value => {
        // console.log('res.data', res.data);
        let githubUsername = value.data.login.toLowerCase();
        // console.log('githubUsername', githubUsername);
        let key = process.env.AES_KEY.split(' ').map(str => parseInt(str));

        let textBytes = aesjs.utils.utf8.toBytes(access_token);
        let aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
        let encryptedBytes = aesCtr.encrypt(textBytes);
        let encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);

        // Decrypt
        // encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);
        // aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
        // let decryptedBytes = aesCtr.decrypt(encryptedBytes);
        // let decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
        // console.log('access token', access_token);
        // console.log('decrypted', decryptedText);

        User.findOneAndUpdate({ githubUsername }, { githubToken: encryptedHex}, { upsert: true, new: true})
        .then(user => {
          req.session.username = user.username || githubUsername;
          req.session.githubUsername = githubUsername;
          req.session.author = value.data.name;
          req.session.userId = user.id;
          req.session.githubToken = encryptedHex;
          req.session.email = value.data.email;
          // console.log('req.session.user', user);
          res.redirect(302, '/');
          return;
        })
        .catch(err => {
          console.log('Create/update user error', err);
          res.status(500).send('Create/update user error');
        });
        
      }).catch(err => {
        console.log('Github get user error', err);
        res.status(500).send('Github get user error');
      });
  }).catch(err => {
    console.log('Github authentication err', err)
    res.status(500).send('Github authentication err');
  });  
}