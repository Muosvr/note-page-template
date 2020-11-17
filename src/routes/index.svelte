<script context="module" lang='ts'>
  import { LOGIN_URL, PAGES_JSON } from '../paths';
  interface Page {
    pageId: string,
    published: boolean
  }
  type Pages = Page[]

  export async function preload(page, session): Promise<{
    pages:Pages,
    userId: string,
    username: string
  }> {
    try {
      const userId: string = session.userId;

      if (!userId) {
				this.redirect(302, LOGIN_URL);
			}
      let url: string = PAGES_JSON;

      const res: any = await this.fetch(url);
      const resJson: Pages = await res.json();

      return { pages: resJson, userId: session.userId, username: session.username};

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

  let pageTitle: string;
  let id: string = uuid();
  let re: RegExp = /(-[\w]+)+$/g;

  const createRedirect = ( title: string ): string =>
    `/${title.replace(" ", "_")}-${id}/edit/?create=true`;
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
  .page-title::first-letter {
    text-transform: capitalize;
  }

</style>

<main>
  <h1 class='page-title'>{`${username}'s Pages`}</h1>
  <UserMenu username={username}/>
  <form>
    <label for="page-name-input">Enter a page title</label>
    <input id="page-name-input" bind:value={pageTitle} />
    {#if pageTitle}<a href={createRedirect(pageTitle)}>create</a>{/if}
  </form>
  <ul>
    {#each (pages || []) as page (page.pageId)}
      <li>
        <a href={`/${page.pageId}`}>
          {`${page.pageId.replace(re, '').replace('_', ' ')} ${page.published ? '': '(draft)'}`}
        </a>
      </li>
    {/each}
  </ul>
</main>
