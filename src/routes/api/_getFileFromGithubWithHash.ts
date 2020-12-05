import { Octokit } from '@octokit/rest'
import atob from 'atob';

interface Params {
  owner: string,
  repo: string,
  token: string,
  path: string
}

type FileWithHas = Promise<{
  file: any,
  sha: string
}>

export default function getFileFromGithubWithHash({
  owner, repo, token, path
}: Params): FileWithHas {
  return new Promise((resolve, reject) => {

    const octokit = new Octokit({
      auth: token
    });

    // let path = `content/${pageId}.json`;

    octokit.repos.getContent({
      owner,
      repo,
      path
    })
      .then((res) => {
        let resStr = atob(res.data.content);
        let pageJson = JSON.parse(resStr);
        resolve({ file: pageJson, sha: res.data.sha })
      })
      .catch((err) => {
        console.log('err', err.message);
        reject(err);
      })
  })
}
