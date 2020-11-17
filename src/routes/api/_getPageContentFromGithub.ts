import { Octokit } from '@octokit/rest'
import { atob } from 'atob';

export default function getPageContentFromGithub(pageId: string) {
  return new Promise((resolve, reject) => {

    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });
    let owner = 'muosvr';
    let repo = 'note-page-sapper';
    let path = `content/${pageId}.json`;

    octokit.repos.getContent({
      owner,
      repo,
      path
    })
      .then((res) => {
        let resStr = atob(res.data.content);
        let pageJson = JSON.parse(resStr)
        resolve(pageJson)})
      .catch((err) => {
        console.log('err', err.message);
        reject(err);
      })
  })
}
