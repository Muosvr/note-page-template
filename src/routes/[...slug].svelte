<script context="module" lang="ts">
  import { store } from "../stores";
  import type { State, PreloadSession } from "../types";

  interface Page {
    params: {
      slug: string[];
    };
  }

  export async function preload(page: Page, session: PreloadSession) {
    let path = page.params.slug.join("/");
    let jsonUrl = `/${path}.json`;

    let resp: any;
    let resJson: State | { error: string };
    try {
      resp = await this.fetch(jsonUrl);
      resJson = await resp.json();
    } catch (err) {
      this.error(500, err);
    }

    if (resp.status !== 200) {
      resJson = resJson as { error: string };
      this.error(resp.status, resJson.error);
      return;
    }

    resJson = resJson as State;
    resJson.pageProps.editingLayout = false;
    resJson.pageProps.focusedBlock = {};

    store.set(resJson);
    return {
      storePreloaded: resJson,
      path,
      username: session.username,
    };
  }
</script>

<script lang="ts">
  import Block from "../components/block/Block.svelte";
  import { onMount } from "svelte";

  export let storePreloaded: State;
  export let path: string;
  export let username;

  let hidden: boolean = true;

  if (storePreloaded) {
    $store = storePreloaded;
  }
  onMount(() => (hidden = false));
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
    position: fixed;
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
  <div class="block">
    <Block />
  </div>
  {#if username}
    <a class="edit-btn" href={`/admin/edit/page?pagePath=${path}`}>Edit this
      page</a>
  {/if}
</main>
