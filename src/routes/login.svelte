<script context="module" lang="ts">
  import type { PreloadSession } from "../types";
  export async function preload(page: any, session: PreloadSession) {
    let githubClientId: string;
    try {
      githubClientId = process.env.GITHUB_CLIENT_ID;
    } catch {}

    return {
      githubClientId,
      githubUsername: session.githubUsername,
      next: page.query.next || "/",
    };
  }
</script>

<script lang="ts">
  import { onMount } from "svelte";
  export let githubClientId: string;
  export let next: string;

  let githubAuthUrl: string;
  let redirect_uri: string;

  onMount(() => {
    const protocol = window.location.host.startsWith("localhost")
      ? "http://"
      : "https://";
    const scope = "user repo";
    redirect_uri = `${protocol}${window.location.host}/api/oauth?next=${next}`;
    githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&scope=${scope}&redirect_uri=${redirect_uri}`;
  });

  const githubAuth = () => {
    window.location.assign(githubAuthUrl);
  };
</script>

<style>
  .page {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: #b0adad;
  }
  .page::after {
    content: "";
    height: 100px;
  }
  .login-container {
    width: 200px;
    background-color: #e4d4ab;
    padding: 30px 50px;
  }
</style>

<div class="page">
  <div class="login-container">
    <h1>Login</h1>
    <button on:click={githubAuth}>Sign In with Github</button>
  </div>
</div>
