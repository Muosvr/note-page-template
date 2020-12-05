<script context="module" lang="ts">
  import type { PreloadSession } from "../../types";
  export async function preload(page, session: PreloadSession) {
    // if (!session.githubUsername) {
    //   this.redirect(302, "/login?next=/admin");
    //   return;
    // }
    return {
      githubRepo: session.repo,
    };
  }
</script>

<script lang="ts">
  // import { getUserRepos } from "../../ajax";

  export let githubRepo: string;
  export let githubRepoLink: string;
  export let domain: string;

  // let repoKeyword = "note-page";
  // let timeout: any;
  // let changingRepo = false;
  // let repos = [];
  // let selectedRepo: string;
  // let showResults = false;

  // const handleRepoSearch = () => {
  //   if (timeout) {
  //     clearTimeout(timeout);
  //   }

  //   timeout = setTimeout(() => {
  //     getUserRepos(repoKeyword)
  //       .then(({ data: { items } }) => {
  //         showResults = true;
  //         repos = items;
  //       })
  //       .catch((err) =>
  //         console.log("err.response.data :>> ", err.response.data)
  //       );
  //   }, 1000);
  // };

  // const handleUpdateRepoName = () => {
  //   console.log("selectedRepo :>> ", selectedRepo);
  // };

  // const handleDropdownSelect = (value: string) => {
  //   showResults = false;
  //   repoKeyword = value;
  //   selectedRepo = value;
  // };
</script>

<style>
  main {
    width: 100%;
    padding: 20px;
  }
  /* .options {
    background-color: rgb(233, 232, 232);
    border: 1px solid grey;
    display: inline-block;
    position: absolute;
    min-width: 235px;
  }
  .dropdown {
    position: relative;
    display: none;
  }
  .option {
    padding: 5px 10px;
    display: block;
    cursor: pointer;
  }
  .option:hover {
    background-color: lightgray;
  }
  .searchbar {
    width: 235px;
  }
  .searchbar,
  .confirm-btn {
    margin-bottom: 0;
  }
  .show {
    display: block;
  } */
</style>

<main>
  <!-- {#if changingRepo}
    <input
      class="searchbar"
      bind:value={repoKeyword}
      on:keyup={handleRepoSearch} />
    <button class="confirm-btn" on:click={handleUpdateRepoName}>Confirm</button>
    <button
      class="cancel-btn"
      on:click={() => (changingRepo = false)}>Cancel</button>
    <div class="dropdown" class:show={showResults}>
      <div class="options">
        {#each repos as repo}
          <div class="option" on:click={() => handleDropdownSelect(repo.name)}>
            {repo.name}
          </div>
        {/each}
      </div>
    </div>
  {:else} -->
  <!-- <button on:click={() => (changingRepo = true)}>Change Repo</button> -->
  <div class="container">
    <h3>{githubRepo}</h3>
    <ul>
      <li><a href={domain} target="_blank">Visit site</a></li>
      <li><a href="/admin/sitemap/" target="_blank">Sitemap</a></li>
      <li><a href={githubRepoLink} target="_blank">Repo (Github)</a></li>
      <li>
        <a href="https://vercel.com/" target="_blank">Deployment (Vercel)</a>
      </li>
    </ul>
  </div>
  <!-- {/if} -->
</main>
