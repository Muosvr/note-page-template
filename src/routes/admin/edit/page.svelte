<script context="module" lang="ts">
	import { store } from "../../../stores";
	import type { State, PreloadSession } from "../../../types";

	interface Page {
		query: {
			pagePath: string;
			create?: "true";
		};
	}

	type PreloadReturn = Promise<{
		create: boolean;
		csrf: string;
		remotePageContent: State;
		pagePath: string;
	}>;

	export async function preload(
		page: Page,
		session: PreloadSession
	): PreloadReturn {
		try {
			const { pagePath } = page.query;
			let editPagePath = `/admin/edit/page`;

			if (!session.username) {
				this.redirect(
					302,
					`/admin/login?next=${editPagePath}?pagePath=${pagePath}`
				);
				return;
			}

			const res = await this.fetch(
				`/admin/edit/page.json?pagePath=${pagePath}`
			);
			const resJson = await res.json();

			// Create a new page if create is true and no existing has been found
			if (res.status === 404) {
				if (page.query.create === "true") {
					return {
						create: true,
						csrf: session.csrf,
						remotePageContent: undefined,
						pagePath,
					};
				} else {
					this.error(404, "Page not found");
					return;
				}
			}

			// If it gets to this point then a page exists, so redirect to remove the create query from the url;
			if (page.query.create === "true") {
				this.redirect(302, `${editPagePath}?pagePath=${pagePath}`);
				return;
			}

			// Set up page if it exists
			return {
				create: false,
				csrf: session.csrf,
				remotePageContent: resJson,
				pagePath,
			};
		} catch (err) {
			this.error(500, err);
		}
	}
</script>

<script lang="ts">
	import Block from "../../../components/block/Block.svelte";
	import { setGlobalCsrf } from "../../../ajax/index";
	import { dispatchToStore } from "../../../stores";
	import { focusBlock, setStoreSaved } from "../../../actions";
	import { onMount } from "svelte";
	import { selectShowToolbar } from "../../../selectors";
	import Sidebar from "../../../components/Sidebar.svelte";

	export let pagePath: string;
	// export let create: boolean;
	export let csrf: string;
	export let remotePageContent: State;

	let hidden: boolean = true;

	setGlobalCsrf(csrf);
	// Save pageId to store for when a new page is created
	// if (create) {
	// 	$store = { ...$store };
	// }

	if (remotePageContent) {
		$store = remotePageContent;
	}

	const handleSavePage = (): void => {
		// Todo: compress json?
		// Handle Storage full
		localStorage.setItem(pagePath, JSON.stringify($store));
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

	onMount((): void => {
		// let localPageContent: State = JSON.parse(localStorage.getItem(pagePath));

		// Todo: use a better way to decide which one to use (timestamp?) so it works on multiple devices
		// if (localPageContent) {
		// 	$store = localPageContent;
		// }

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
		on:click={() => dispatchToStore(focusBlock({ id: '' }))}>
		<div class="block">
			<Block />
		</div>
	</div>
	<Sidebar />
</main>
