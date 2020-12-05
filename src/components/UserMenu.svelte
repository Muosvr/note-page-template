<script lang="ts">
  // import { logout } from "../ajax";
  import { goto } from "@sapper/app";
  export let username: string;

  const handleLogout = (): void => {
    goto("/logout");
    // logout()
    //   .then(() => window.location.reload())
    //   .catch(() => console.log("Logout error"));
  };
</script>

<style>
  .user-menu {
    float: right;
    right: 0;
    top: 0;
    padding: 10px;
    position: absolute;
    z-index: 50;
  }
  .logout {
    cursor: pointer;
  }
</style>

<div class="user-menu">
  {#if username}
    <span class="username">{username}</span>
    <span>|</span>
    <span class="logout" on:click={handleLogout}>Logout</span>
  {:else}
    <a href="/auth/register">Register</a>
    <span>|</span>
    <a href="/auth/login">Login</a>
  {/if}
</div>
