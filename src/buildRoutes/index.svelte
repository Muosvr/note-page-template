<script context="module" lang='ts'>
  interface Page {
    pageId: string,
    published: boolean
  }
  type Pages = Page[]

  export async function preload(page, session): Promise<{
    pages:Pages,
    username: string,
    owner: string
  }> {
    try {
      let { username }: {username: string} = page.params;
      let url: string = `/${username}.json`;

      try{
        if (process.env.USERNAME) {
          username = process.env.USERNAME;
          url = 'index.json';
        };
      }catch{};
      
      // console.log('pathUsername', username)
      

      const res: any = await this.fetch(url);
      const resJson: Pages = await res.json();
      // console.log('resJson', resJson);
      return { pages: resJson, username: session.username, owner:username };

    }catch (error) {
      this.error(500, error);
    }
  }
</script>

<script lang='ts'>
  import { v4 as uuid } from "uuid";
  import UserMenu from '../components/UserMenu.svelte';
  
  export let pages: Pages;
  export let username: string;
  export let owner: string;

  let pageTitle: string;
  let shortId: string = uuid().split("-")[0];
  let re: RegExp = /-.{8}$/g;

  const createRedirect = ( title: string ): string =>
    `/${username}/${title.replace(" ", "_")}-${shortId}/edit/?create=true`;
</script>
<style>
  main {
    padding: 0 1em;
    position: relative;
    margin-left: 20%;
  }
  @media screen and (max-width: 600px){
    main {
      margin-left: 0;
    }
  }

</style>

<main>
  <h1>{`${owner}'s Pages`}</h1>
  <UserMenu username={username}/>
  {#if username}
    <form>
      <label for="page-name-input">Enter a page title</label>
      <input id="page-name-input" bind:value={pageTitle} />
      {#if pageTitle}<a href={createRedirect(pageTitle)}>create</a>{/if}
    </form>
  {/if}
  <ul>
    {#each (pages || []) as page (page.pageId)}
      <li>
        <a href={`/${owner}/${page.pageId}`}>
          {`${page.pageId.replace(re, '').replace('_', ' ')} ${page.published ? '': '(draft)'}`}
        </a>
      </li>
    {/each}
  </ul>
</main>
