import axios from 'axios';
import type { State } from '../types'
import { getPageJsonUrl, getPageEditJsonUrl } from '../paths';

const BASE_URL = '/';

const BASE_API_URL = BASE_URL + 'api/'

const BASE_PAGE_URL = BASE_API_URL + 'page/';

const REGISTER_URL = BASE_API_URL + 'register/';
const LOGIN_URL = BASE_API_URL + 'login/';
const LOGOUT_URL = BASE_API_URL + 'logout/'

const BUILD_URL = BASE_API_URL + 'build/';

export const setGlobalCsrf = (csrf: string):void => {
  axios.defaults.headers.common = {
    'CSRF-Token': csrf
  };
}


export const getPageJson = ( pageId: string ) => (
  axios.get(getPageJsonUrl( pageId ))
)

export const getPageContentFromGithub = ( pageId: string) => (
  axios.get(getPageEditJsonUrl(pageId))
)

export const commitPageContentToGithub = ( pageId: string, payload: State ) => (
  axios.put(getPageEditJsonUrl( pageId ), payload)
)

export const uploadFile = ({ file }) => {
  const formData = new FormData();
  formData.append('image', file);
  return axios.post(BASE_API_URL + 'upload' + '/', formData, {
    headers: {
      'content-type': 'multipart/form-data'
    }
  });
}

export const register = (
  { username, password, csrf }: { username: string, password: string, csrf: string }
) => {
  return axios.post(REGISTER_URL, { username, password });
}

export const login = (
  { username, password, csrf }: { username: string, password: string, csrf: string }
) => {
  return axios.post(LOGIN_URL, { username, password });
}

export const logout = () => axios.get(LOGOUT_URL);

// export const buildSite = () => axios.post(BUILD_URL);
