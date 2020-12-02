<script lang="ts">
	import { store, dispatchToStore } from "../../stores";
	import {
		focusBlock,
		toggleEditLayout,
		toggleEditText,
		toggleToolbar,
		togglePublishPage,
	} from "../../actions";
	import { selectShowToolbar } from "../../selectors";
	import { commitPageContentToGithub, buildSite } from "../../ajax";
	import { onMount } from "svelte";

	let building = false;
	let buildMessage: "Success" | "Failed" | "Commiting..." | "Idle" = "Idle";
	let pagePath: string;

	onMount(() => {
		let urlParams = new URLSearchParams(window.location.search);
		pagePath = urlParams.get("pagePath");
	});

	const toggleEdit = () => {
		if ($store.pageProps.editingLayout) {
			dispatchToStore(focusBlock({ id: "" }));
		}
		dispatchToStore(toggleEditLayout());
		dispatchToStore(toggleEditText());
	};

	const handleToggleToobar = () => dispatchToStore(toggleToolbar());
	const handlePublishPage = () => dispatchToStore(togglePublishPage());

	const handleCommit = () => {
		building = true;
		buildMessage = "Commiting...";
		commitPageContentToGithub($store, pagePath)
			.then(() => {
				localStorage.removeItem($store.pageId);
				buildMessage = "Success";
				building = false;
			})
			.catch((err) => {
				console.log("Commit error", err);
				buildMessage = "Failed";
				building = false;
			});
	};

	const handleBuild = () => {
		buildSite().catch((err) => {
			console.log("Build error", err);
		});
	};
</script>

<style>
	.toolbar-toggle {
		position: fixed;
		bottom: 10px;
		left: 30px;
		z-index: 20;
		border: 2px solid white;
		background-color: black;
		color: white;
		opacity: 60%;
		box-shadow: 0 0 3px grey;
	}
	.toolbar-toggle:hover,
	.preview-btn:hover {
		opacity: 100%;
		box-shadow: 0 0 7px grey;
	}
	.preview-btn {
		position: fixed;
		bottom: 10px;
		left: 160px;
		z-index: 20;
		border: 2px solid white;
		background-color: black;
		color: white;
		opacity: 60%;
		box-shadow: 0 0 3px grey;
	}

	.close-toolbar-btn {
		position: absolute;
		right: 10px;
		top: 10px;
		padding: 5px 9px;
	}

	button {
		cursor: pointer;
	}
	#toolbar {
		position: fixed;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: left;
		background-color: rgb(255, 255, 255);
		top: 0px;
		left: 0px;
		width: 250px;
		height: 100%;
		box-shadow: 1px 0px 5px grey;
		padding: 10px 8px;
		overflow: auto;
	}

	.hidden {
		visibility: hidden;
	}

	.status {
		margin-bottom: 20px;
	}
</style>

<div id="toolbar" class:hidden={!$store.pageProps.showToolbar}>
	<div class="status">{`Status: ${$store.saved ? 'Saved' : 'Modified'}`}</div>
	<button on:click={handleToggleToobar} class="close-toolbar-btn">x</button>
	<button on:click={toggleEdit}>
		{$store.pageProps.editingLayout ? 'Preview Page' : 'Edit Page'}
	</button>
	<button on:click={handlePublishPage}>
		{$store.published ? 'Unpublish Page' : 'Publish Page'}
	</button>
	<button
		disabled={building}
		on:click={handleCommit}>{'Commit Changes'}</button>
	<button on:click={handleBuild}>Build Site</button>
	<div>Build Status: {buildMessage}</div>
	<slot />
</div>
<button
	class="toolbar-toggle"
	class:hidden={selectShowToolbar($store)}
	on:click={handleToggleToobar}>Show Toolbar</button>
<button
	class="preview-btn"
	class:hidden={selectShowToolbar($store)}
	on:click={toggleEdit}>
	{$store.pageProps.editingLayout ? 'Preview' : 'Edit'}
</button>
