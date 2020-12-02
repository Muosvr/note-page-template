<script lang="ts">
  import { createBranchInSitemap, removeBranchFromSitemap } from "../helpers";
  import { updateSitemap } from "../ajax";
  import { goto } from "@sapper/app";
  import type { Sitemap } from "../types";

  export let branch: Sitemap;
  export let key: string = "";
  export let path: string = "";
  export let sitemap: Sitemap;
  export let showCreatePath: string = undefined;

  let name = branch["$name"];
  let pageContent = branch["$jsonFile"];

  let newRouteName: string;

  const handleCreateRoute = (addMore = false) => {
    // Todo: error handling for name collision with sibling;
    let newSubpath = newRouteName.trim().toLowerCase().replace(/[^\w]/g, "-");
    let newBranch: Sitemap = {
      $name: newRouteName,
    };
    let newSitemap = createBranchInSitemap(
      path,
      sitemap,
      newBranch,
      newSubpath
    );
    let oldSitemap: Sitemap = { ...sitemap };
    sitemap = newSitemap;
    newRouteName = "";
    if (!addMore) {
      showCreatePath = undefined;
    }
    updateSitemap(newSitemap).catch((err) => {
      sitemap = oldSitemap;
      console.log("Update sitemap error", err);
    });
  };

  const handleDeletePath = () => {
    // Todo: Add confirm delete workflow
    // Todo: Add ability to change path name
    let newSitemap: Sitemap = removeBranchFromSitemap(path, sitemap);
    let oldSitemap: Sitemap = { ...sitemap };
    sitemap = newSitemap;

    updateSitemap(newSitemap).catch((err) => {
      sitemap = oldSitemap;
      console.log("Remove sitemap error", err);
    });
  };
</script>

<style>
  .create-path-btn,
  .create-page-btn,
  .delete-btn {
    padding: 3px 5px;
    margin: 0;
    margin-left: 10px;
    cursor: pointer;
  }
  li {
    height: 40px;
  }

  li {
    display: flex;
    align-items: center;
  }
  .control {
    display: none;
  }
  li:hover > .control {
    display: inline;
  }

  .create-path-form {
    margin: 0;
    display: flex;
    align-items: center;
  }
  button,
  input {
    margin-top: 0;
    margin-bottom: 0;
    margin-right: 10px;
  }
</style>

<ul>
  <li>
    -&gt;
    {#if pageContent}&nbsp;<a href={path}>{name}</a>&nbsp;{:else}{name}{/if}
    {' '}
    /{key}
    <span class="control">
      <button class="create-path-btn" on:click={() => (showCreatePath = path)}>
        Create Path
      </button>

      {#if !pageContent}
        <button
          class="create-page-btn"
          on:click={() => goto(`/admin/edit/page?pagePath=${path}&create=true`)}>
          Create Page
        </button>
      {/if}

      <button
        class="delete-btn"
        on:click={() => handleDeletePath()}>Delete</button>
    </span>
  </li>

  {#each Object.keys(branch) as subbranchKey}
    {#if !['$name', '$jsonFile'].includes(subbranchKey)}
      <svelte:self
        branch={branch[subbranchKey]}
        key={subbranchKey}
        path={`${path}/${subbranchKey}`}
        bind:showCreatePath
        bind:sitemap />
    {/if}
  {/each}

  {#if showCreatePath === path}
    <ul>
      <li>
        -&gt;&nbsp;
        <div class="create-path-form">
          <input
            placeholder="Name your route"
            bind:value={newRouteName}
            type="text" />
          <button on:click={() => handleCreateRoute()}>Done</button>
          <button on:click={() => handleCreateRoute(true)}>Add More</button>
        </div>
      </li>
    </ul>
  {/if}
</ul>
