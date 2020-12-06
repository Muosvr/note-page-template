<script lang="ts">
  import { capitalize } from "../helpers";
  export let username: string;

  const handleLogout = (): void => {
    window.location.assign("/admin/logout");
  };
</script>

<style>
  .user-menu {
    float: right;
    /* right: 0; */
    /* top: 0; */
    padding: 10px;
    /* position: absolute; */
    z-index: 50;
  }
</style>

<div class="user-menu">
  {#if username}
    <span class="username">{capitalize(username)}</span>
    <span>|</span>
    <a href="/admin/logout">Logout</a>
  {:else}
    <a href="/auth/register">Register</a>
    <span>|</span>
    <a href="/admin/login">Login</a>
  {/if}
</div>
