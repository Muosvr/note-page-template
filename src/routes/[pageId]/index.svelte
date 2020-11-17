<script context="module" lang='ts'>
	import { store } from "../../stores";
	import type { State } from "../../types";
	import { LOGIN_URL, getPageEditUrl } from '../../paths';
	export async function preload(page, session): Promise<{
    storePreloaded: State, 
    pageId: string, 
    create: boolean
	}> {
		try {
			const { pageId }: { pageId: string} = page.params;
			const userId = session.userId;

			if (!userId) {
				this.redirect(LOGIN_URL);
				return;
			}

			const url: string = `/${pageId}.json`;
			const res = await this.fetch(url);
			const resJson = await res.json();

      if (!resJson){
				this.error(404, 'Page does not exist');
				return;
      }
      resJson.pageProps.editingLayout = false;
      resJson.pageProps.focusedBlock = '';

      // Set up page if it exists
			store.set(resJson);
			return { 
        storePreloaded: resJson, 
        pageId,
				create: false,
      };
		} catch (err) {
			this.error(500, err)
		}
	}
</script>

<script lang='ts'>
	import Block from "../../components/block/Block.svelte";
	import { onMount } from "svelte";

  export let storePreloaded: State;
	export let pageId: string;
	
	const pageEditUrl = getPageEditUrl(pageId);

	let hidden: boolean = true;

	if (storePreloaded) {
		$store = storePreloaded;
  }
  onMount(() => hidden = false)

</script>

<style>
	:global(body) {
		padding: 0;
		background-color: #ffffff;
	}
	:global(.ql-toolbar) {
		z-index: 100;
	}

	.block {
		max-width: 1024px;
		margin: auto;
		padding: 0 1em;
	}

	.hidden {
		visibility: hidden;
	}

  .edit-btn {
    position:fixed;
    bottom: 20px;
    left: 40px;
    padding: 10px;
		border: 2px solid white;
		background-color: black;
		color: white;
		opacity: 60%;
		box-shadow: 0 0 3px grey;
  }

</style>

<main class:hidden>
  <div class='block'>
    <Block />
  </div>
    <a class='edit-btn' href={pageEditUrl}>Edit this page</a>
</main>
