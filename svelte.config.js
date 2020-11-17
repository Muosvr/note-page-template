// for vscode: https://github.com/sveltejs/svelte-preprocess/blob/master/docs/usage.md#with-svelte-vs-code
// for less: https://github.com/sveltejs/language-tools/blob/master/docs/preprocessors/scss-less.md

const sveltePreprocess = require('svelte-preprocess');

const defaults = {
	script: "typescript",
};

module.exports = {
  preprocess: sveltePreprocess({ defaults })
};