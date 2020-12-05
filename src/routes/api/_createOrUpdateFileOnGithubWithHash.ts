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
  sha?: string,
  message?: string
}

export default function createOrUpdateFileOnGithub({
  content, owner, repo, name, email, token, path, sha, message = 'New content'
}: Params) {

  return new Promise((resolve, reject) => {

    const octokit = new Octokit({
      auth: token
    });

    let committer = {
      name,
      email
    }

    let contentStr = JSON.stringify(content);
    let contentB64 = btoa(contentStr);

    octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content: contentB64,
      sha,
      committer,
      author: committer
    })
      .then(value => resolve(value))
      .catch((err) => {
        console.log('err', err.message);
        reject(err);
      })
  })
}
