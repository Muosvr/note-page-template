import type { SitemapPage, Sitemap } from './types';
import { BRANCH_NOT_FOUND_ERROR, FILE_NOT_FOUND_ERROR } from './constants';

export function urlToHTMLPath(url: string) {
  return url.split('/').join('&#47;').split(' ').join('&nbsp;');
}

function validateUrlAndConvertToArray(url: string | string[]) {
  if (typeof url === 'string') {
    if (url.startsWith('http')) {
      throw Error('getJsonFileNameFromSitemap cannot process external url, use internal path pattern instead')
    }
    // Filter out empty path string
    url = url.split('/').filter(path => path);
  }
  return url
}

export function createBranchInSitemap(locationUrl: string | string[], sitemap: Sitemap, branch: Sitemap, branchKey: string) {
  locationUrl = validateUrlAndConvertToArray(locationUrl);

  let newSitemap: Sitemap = { ...sitemap };
  let currentBranch: Sitemap = newSitemap;
  locationUrl.forEach(path => {
    currentBranch = currentBranch[path];
  });

  if (!currentBranch) {
    throw Error('Location not found');
  };

  if (currentBranch[branchKey]) {
    throw Error('Branch already exists');
  }

  currentBranch[branchKey] = branch;
  return newSitemap;
}

export function createOrUpdateBranchInSitemap(locationUrl: string | string[], sitemap: Sitemap, branch: Sitemap) {
  locationUrl = validateUrlAndConvertToArray(locationUrl);
  let branchKey = locationUrl.pop();

  let newSitemap = { ...sitemap };
  let currentBranch = newSitemap;
  locationUrl.forEach(path => {
    currentBranch = currentBranch[path];
  });

  if (!currentBranch) {
    throw Error('Location not found');
  };

  if (currentBranch[branchKey]) {
    currentBranch[branchKey] = { ...currentBranch[branchKey], ...branch }
  } else {
    currentBranch[branchKey] = branch;
  }
  return newSitemap;
}

export function removeBranchFromSitemap(locationUrl: string | string[], sitemap: Sitemap) {
  locationUrl = validateUrlAndConvertToArray(locationUrl);
  let newSitemap = { ...sitemap }
  let currentBranch = newSitemap;

  let lastPath = locationUrl.pop();

  locationUrl.forEach((path, i) => {
    currentBranch = currentBranch[path]
  })

  delete currentBranch[lastPath];
  return newSitemap;
}

export function getBranchFromSitemap(url: string | string[], sitemap: Sitemap) {
  url = validateUrlAndConvertToArray(url);

  return url.reduce((lastRes, pathKey) => {

    let subBranch = lastRes[pathKey];

    if (!subBranch) {
      throw Error(BRANCH_NOT_FOUND_ERROR);
    }

    return subBranch
  }, sitemap)
}

export function getPageFromSitemap(url: string | string[], sitemap: Sitemap): SitemapPage {

  let branch = getBranchFromSitemap(url, sitemap);

  // only return page info, ignore subbranches
  return {
    "$name": branch["$name"],
    "$jsonFile": branch["$jsonFile"]
  }
}

export function getJsonFileNameFromSitemap(url: string | string[], sitemap: Sitemap): string {
  let page = getPageFromSitemap(url, sitemap);
  let jsonFile = page['$jsonFile'];
  if (!jsonFile) {
    throw Error(FILE_NOT_FOUND_ERROR);
  }

  return page["$jsonFile"];
}

// Helper to clean non utf-8 characters
// function cleanString(input: string) {
//   var output = "";
//   for (var i = 0; i < input.length; i++) {
//     if (input.charCodeAt(i) <= 127) {
//       output += input.charAt(i);
//     }
//   }
//   return output;
// }

export function cleanString(input: string) {
  let strArr = [];
  for (let i = 0; i < input.length; i++) {
    if (input.charCodeAt(i) <= 127 && input.charCodeAt(i) >= 32) {
      strArr.push(input.charAt(i));
    }
  }
  return strArr.join('');
}

export function toAllCapSnakeCase(value: string): string {
  const arr = value.split('');
  let newArr = [];
  arr.forEach((letter, index) => {
    if (letter === '-') {
      newArr.push('_');
    } else {
      newArr.push(letter.toUpperCase());
    }
    const nextCharCode = value.charCodeAt(index + 1);
    if (nextCharCode >= 65 && nextCharCode <= 90) {
      newArr.push('_');
    };
  })
  return newArr.join('');
}