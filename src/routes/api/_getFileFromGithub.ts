import { Octokit } from '@octokit/rest'
import atob from 'atob';
import { cleanString } from '../../helpers';

export default function getFileFromGithub({
  owner, repo, token, path
}: {
  owner: string, repo: string, token: string, path: string
}) {
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
        let cleaned = cleanString(resStr);
        let pageJson = JSON.parse(cleaned);
        resolve(pageJson)
      })
      .catch((err) => {
        console.log('err', err.message);
        reject(err);
      })
  })
}
