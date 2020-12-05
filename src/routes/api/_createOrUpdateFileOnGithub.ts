import { Octokit } from '@octokit/rest'
import btoa from 'btoa';

interface Params {
  content: any,
  owner: string,
  repo: string,
  name: string,
  email: string,
  token: string,
  path: string,
}

export default function createOrUpdateFileOnGithub({
  content, owner, repo, name, email, token, path
}: Params) {

  return new Promise((resolve, reject) => {

    const octokit = new Octokit({
      auth: token
    });

    let message = 'New content';

    let committer = {
      name,
      email
    }

    let contentStr = JSON.stringify(content);
    let contentB64 = btoa(contentStr);
    let sha: string;

    octokit.repos.getContent({
      owner,
      repo,
      path
    })
      .then(resp => {
        sha = resp.data.sha;
      })
      .catch(err => {
        if (err.status === 404) {
          return;
        }
        throw err;
      })
      .then(() => {
        return octokit.repos.createOrUpdateFileContents({
          owner,
          repo,
          path,
          message,
          content: contentB64,
          sha,
          committer,
          author: committer
        })

      }).then(() => resolve())
      .catch((err) => {
        console.log('err', err.message);
        reject(err);

      })
  })
}
