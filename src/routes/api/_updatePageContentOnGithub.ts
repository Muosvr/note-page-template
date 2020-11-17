import { Octokit } from '@octokit/rest'
import btoa from 'btoa';

export default function updatePageContentOnGithub(pageJson: any) {
  return new Promise((resolve, reject) => {

    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });
    let owner = 'muosvr';
    let repo = 'note-page-sapper';
    let path = `content/${pageJson.pageId}.json`;
    let message = 'New content';
    // let branch = '20201114_github_as_db';

    let committer = {
      name: 'Jason',
      email: 'lujason2015@gmail.com'
    }

    let contentStr = JSON.stringify(pageJson);
    let contentB64 = btoa(contentStr);
    let sha;

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
