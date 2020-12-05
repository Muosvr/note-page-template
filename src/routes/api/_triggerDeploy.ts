import getFileFromGithubWithHash from './_getFileFromGithubWithHash';
import createOrUpdateFileOnGithubWithHash from './_createOrUpdateFileOnGithubWithHash';

type Params = {
  githubUsername: string,
  githubToken: string,
  email: string,
  author: string,
  repo: string
}

// Todo: apply this to build.ts
export default function triggerDeploy({ githubUsername, githubToken, email, author, repo }: Params): Promise<void> {

  let vercelJsonPath = 'vercel.json'
  let vercelJson: any;

  return new Promise((resolve, reject) => {
    getFileFromGithubWithHash({
      owner: githubUsername,
      repo,
      token: githubToken,
      path: vercelJsonPath
    })
      .then(({ file: vercelJsonRes, sha }) => {
        vercelJsonRes.github = {
          enabled: true
        }
        vercelJson = vercelJsonRes;
        return createOrUpdateFileOnGithubWithHash({
          content: vercelJsonRes,
          owner: githubUsername,
          repo,
          email,
          token: githubToken,
          path: vercelJsonPath,
          name: author,
          sha
        })
      })
      .then((value: any) => {
        let sha = value.data.content.sha;
        vercelJson.github = {
          enabled: false
        }
        return createOrUpdateFileOnGithubWithHash({
          content: vercelJson,
          owner: githubUsername,
          repo,
          email,
          token: githubToken,
          path: vercelJsonPath,
          name: author,
          sha
        })
      })
      .then(() => resolve())
      .catch(() => reject())
  })
}