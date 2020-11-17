<script context="module" lang='ts'>
	import { store } from "../../stores";
	import type { State } from "../../types";
	import { getPageEditUrl, getPageEditJsonUrl } from '../../paths';
	export async function preload(page, session): Promise<{
    pageId: string, 
		create: boolean,
		csrf: string,
		remotePageContent: string,
	}> {
		try {
			const pageId: string = page.params.pageId;
			const url: string = getPageEditJsonUrl(pageId);

			// Todo: try using getUserPage here instead
			const res = await this.fetch(url);
			const resJson = await res.json();

			// Create a new page if create is true and no existing has been found
			if (res.status === 404){
        if (page.query.create === "true"){
          return {
            pageId,
            create: true,
						csrf: session.csrf,
						remotePageContent: undefined,
          };
        } else {
					this.error(404, 'Page not found');
					return;
        }
      }

			// If it gets to this point then a page exists, so redirect to remove the create query from the url;
      if (page.query.create === "true"){
				this.redirect(302, getPageEditUrl(pageId))
				return;
      }

      // Set up page if it exists
			return { 
        pageId,
				create: false,
				csrf: session.csrf,
				remotePageContent: resJson
      };
		} catch (err) {
			this.error(500, err)
		}
	}
</script>

<script lang='ts'>
	import Block from "../../components/block/Block.svelte";
	import { setGlobalCsrf } from "../../ajax";
	import { dispatchToStore } from "../../stores";
	import {
		focusBlock,
		setStoreSaved,
	} from "../../actions";
	import { onMount } from "svelte";
	import { selectShowToolbar } from "../../selectors";
	import Sidebar from "../../components/Sidebar.svelte";

	export let pageId: string;
	export let create: boolean;
	export let csrf: string;
	export let remotePageContent: State;

	let hidden: boolean = true;

	setGlobalCsrf(csrf);
	// Save pageId to store for when a new page is created
	if (create){
		$store = {...$store, pageId};	
	}

	if (remotePageContent){
		$store = remotePageContent;
	}


	const handleSavePage = (): void => {
		// Todo: compress json?
		// Handle Storage full
		localStorage.setItem(pageId, JSON.stringify($store));
		dispatchToStore(setStoreSaved());
	};

	const autoSave = (): void => {
		handleSavePage();
		setInterval(() => {
			if (!$store.saved) {
				handleSavePage();
			}
		}, 5000);
		window.onbeforeunload = (): void => {
			if (!$store.saved) {
				alert("Page not saved, confirm to leave?");
				handleSavePage();
			}
		};
	};

	onMount(():void => {
		console.log('pageId', pageId);
		let localPageContent: State = JSON.parse(localStorage.getItem(pageId));
		
		// Todo: use a better way to decide which one to use (timestamp?) so it works on multiple devices
		if (localPageContent) {
			$store = localPageContent;
		};

		autoSave();
		hidden = false;
	});

</script>

<style>
	:global(body) {
		padding: 0;
		background-color: #ffffff;
	}
	:global(.ql-toolbar) {
		z-index: 100;
	}

	main {
		position: relative;
	}
	.page {
		margin: 0;
	}

	.makeWayForToolbar {
		margin-left: 266px;
	}

	.block {
		max-width: 1024px;
		margin: auto;
		padding: 0 1em;
	}

	.hidden {
		visibility: hidden;
	}

</style>

<main class:hidden>
  <div 
    class="page"
    class:makeWayForToolbar={selectShowToolbar($store)}
    on:click={() => dispatchToStore(focusBlock({id: ''}))}
    >
    <div class='block'>
      <Block/>
    </div>
  </div>
  <Sidebar />
</main>
