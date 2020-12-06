<script context="module" lang="ts">
  import type { PreloadSession } from "../../types";
  export async function preload(_: any, session: PreloadSession) {
    return {
      username: session.username,
    };
  }
</script>

<script lang="ts">
  import UserMenu from "../../components/UserMenu.svelte";
  export let username: string;
  export let segment: string;
</script>

<main>
  {#if !['login', 'edit'].includes(segment)}
    <UserMenu {username} />
  {/if}
  <slot />
</main>
