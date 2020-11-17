let BASE_URL = '';
try {
  BASE_URL = process.env.BASE_URL || ''
}catch{}

export const AUTH_URL = BASE_URL + '/auth';
export const LOGIN_URL = AUTH_URL + '/login';
export const LOGOUT_URL = AUTH_URL + '/logout';

export const PAGES_JSON = `${BASE_URL}/pages.json`;

export const getPageUrl = ( pageId: string ): string => `${BASE_URL}/${pageId}`;
export const getPageJsonUrl = ( pageId: string ): string => `${BASE_URL}/${pageId}.json`;


export const getPageEditUrl = ( pageId: string ): string => `${BASE_URL}/${pageId}/edit`;
export const getPageEditJsonUrl = ( pageId: string ): string => `${BASE_URL}/${pageId}/edit.json`;