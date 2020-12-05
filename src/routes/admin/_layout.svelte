<script context="module" lang="ts">
  import type { PreloadSession } from "../../types";
  export async function preload(page, session: PreloadSession) {
    return {
      username: session.githubUsername,
    };
  }
</script>

<script lang="ts">
  import UserMenu from "../../components/UserMenu.svelte";
  export let username: string;
</script>

<main>
  <UserMenu {username} />
  <slot />
</main>
