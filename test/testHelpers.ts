import assert from 'assert';
import {
  createBranchInSitemap,
  createOrUpdateBranchInSitemap,
  getBranchFromSitemap,
  getJsonFileNameFromSitemap,
  getPageFromSitemap,
  removeBranchFromSitemap
} from '../src/helpers';
import type { Sitemap } from '../src/types';

const generateSitemap = () => ({
  "$name": "home",
  "$jsonFile": "f946dfcc-cd0b-41e8-8295-3fae87163665.json",
  "blog": {
    "$name": "Blog",
    "how-to-cook": {
      "$name": "How to cook",
      "$jsonFile": "jasonblog-c470e07c-fdef-4767-bbdf-5a44838c3036.json",
      "tips-about-cooking": {
        "$name": "Tipes About Cooking"
      }
    },
    "another-page": {
      "$name": "Another Page",
      "$jsonFile": "f946dfcc-cd0b-41e8-8295-3fae87163665.json"
    }
  }
})
let sitemap: Sitemap;
describe('Test Sitemap helpers', () => {
  beforeEach(() => {
    sitemap = generateSitemap();
  })
  it('createBranchInSitemap should create branch', () => {
    let branch = { "$name": "Testing", "$jsonFile": "test-json-file.json" }
    let newSitemap = createBranchInSitemap('/blog', sitemap, branch, 'test')
    assert(newSitemap['blog']['test']['$name'] === 'Testing');
    assert(newSitemap['blog']['test']['$jsonFile'] === 'test-json-file.json')
  })

  it('createOrUpdateBranchInSitemap can update branch', () => {
    let branch = { "$name": "Testing", "$jsonFile": "test-json-file.json" };
    let newSitemap = createOrUpdateBranchInSitemap('/blog/another-page', sitemap, branch);
    assert(newSitemap['blog']['another-page']['$name'] === 'Testing');
    assert(newSitemap['blog']['another-page']['$jsonFile'] === 'test-json-file.json')
  })

  it('createOrUpdateBranchInSitemap can create branch', () => {
    let branch = { "$name": "Testing", "$jsonFile": "test-json-file.json" }
    let newSitemap = createOrUpdateBranchInSitemap('/blog/test', sitemap, branch,)
    assert(newSitemap['blog']['test']['$name'] === 'Testing');
    assert(newSitemap['blog']['test']['$jsonFile'] === 'test-json-file.json')
  })

  it('removeBranchFromSitemap should work', () => {
    let newSitemap = removeBranchFromSitemap('/blog/another-page', sitemap);
    assert(newSitemap['blog']['another-page'] === undefined);
  })

  it('getBranchFromSitemap shoudl work', () => {
    let branch = getBranchFromSitemap('/blog/another-page', sitemap);
    assert(branch['$name'] === 'Another Page');
  })

  it('getPageFromSitemap should only return page info', () => {
    let page = getPageFromSitemap('/blog/how-to-cook', sitemap);
    assert(!Object.keys(page).includes("tips-about-cooking"));
    assert(page["$name"] === "How to cook");
    assert(page["$jsonFile"] === "jasonblog-c470e07c-fdef-4767-bbdf-5a44838c3036.json");
  })

  it('getJsonFileNameFromSitemap should work', () => {
    let fileName = getJsonFileNameFromSitemap('/blog/how-to-cook', sitemap);
    assert(fileName === "jasonblog-c470e07c-fdef-4767-bbdf-5a44838c3036.json");
  })
})