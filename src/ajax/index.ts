import axios from 'axios';
import type { State } from '../types'
import { getPageJsonUrl, getPageEditJsonUrl } from '../paths';
// import { urlToHTMLPath } from '../helpers';

const BASE_URL = '/';

const BASE_API_URL = BASE_URL + 'api/'

// const BASE_PAGE_URL = BASE_API_URL + 'page/';

// const REGISTER_URL = BASE_API_URL + 'register/';

// const ADMIN_LOGIN_URL = BASE_API_URL + 'login/';

// const LOGOUT_URL = BASE_URL + 'logout/'

// const BUILD_URL = BASE_API_URL + 'build/';

const SITEMAP_JSON_URL = '/admin/sitemap.json';

export const setGlobalCsrf = (csrf: string): void => {
  axios.defaults.headers.common = {
    'CSRF-Token': csrf
  };
}


export const getPageJson = (pageId: string) => (
  axios.get(getPageJsonUrl(pageId))
)

export const commitPageContentToGithub = (store: State, pagePath: string) => {
  return axios.put(`/admin/edit/page.json?pagePath=${pagePath}`, store)
}

export const uploadFile = ({ file }) => {
  const formData = new FormData();
  formData.append('image', file);
  return axios.post(BASE_API_URL + 'upload' + '/', formData, {
    headers: {
      'content-type': 'multipart/form-data'
    }
  });
}

// export const register = (
//   { username, password, csrf }: { username: string, password: string, csrf: string }
// ) => {
//   return axios.post(REGISTER_URL, { username, password });
// }

export const login = (username: string, password: string) => {
  return axios.post('/admin/login.json', { username, password });
}

// export const logout = () => axios.get(LOGOUT_URL);

export const updateSitemap = (payload) => axios.put(SITEMAP_JSON_URL, payload);

export const buildSite = () => axios.post('/api/build');

// export const getGithubLoginLink = () => axios.get('/api/oauth');

export const createGithubRepo = (repoName: string) => axios.post('/builder/createRepo', { repoName });

export const createVercelProject = (adminUsername: string, adminPassword: string) => axios.post('/builder/setupVercel', { adminUsername, adminPassword });

export const getUserRepos = (keyword: string) => axios.get(`/api/getRepos?keyword=${keyword}`);
