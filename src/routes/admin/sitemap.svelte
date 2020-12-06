<script context="module" lang="ts">
  import type { PreloadSession, Sitemap } from "../../types";
  export async function preload(_: any, session: PreloadSession) {
    if (!session.username) {
      this.redirect(302, `/admin/login?next=/admin/sitemap`);
    }

    const url = "/admin/sitemap.json";
    let res: any;
    let json: Sitemap;

    try {
      res = await this.fetch(url);
      json = await res.json();
    } catch (err) {
      this.error(500, err.message);
    }

    if (res.status === 404) {
      this.error(404, "Content not found");
      return;
    }

    return { sitemap: json, csrf: session.csrf };
  }
</script>

<script lang="ts">
  import SitemapEditor from "../../components/SitemapEditor.svelte";
  import { setGlobalCsrf } from "../../ajax";

  export let sitemap: Sitemap;
  export let csrf: string;

  setGlobalCsrf(csrf);

  // Todo: Also delete content files when sitemap branch is deleted
</script>

<div>
  <SitemapEditor branch={sitemap} key="" bind:sitemap />
</div>
