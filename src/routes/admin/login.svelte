<script context="module" lang="ts">
  import type { PreloadSession } from "../../types";
  export async function preload(page: any, session: PreloadSession) {
    return {
      csrf: session.csrf,
      next: page.query.next || "/",
    };
  }
</script>

<script lang="ts">
  import { login, setGlobalCsrf } from "../../ajax";
  import { goto } from "@sapper/app";
  import _ from "lodash";

  export let next: string;
  export let csrf: string;

  let password: string;
  let username: string;
  let loginMessage = "";

  setGlobalCsrf(csrf);

  const handleLogin = (e: Event) => {
    e.preventDefault();
    login(username, password)
      .then(() => {
        console.log(":>> logged in");
        goto(next);
      })
      .catch((err) => {
        if (_.get(err, "response.status") === 403) {
          loginMessage = "Invalid credential";
        }
      })
      .finally(() => {
        password = "";
        username = "";
      });
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
    display: block;
    width: 300px;
    background-color: #e4d4ab;
    padding: 30px 50px;
  }
  .error-message {
    color: red;
  }
  .login-btn {
    display: block;
    margin-top: 20px;
    width: 100px;
  }
</style>

<div class="page">
  <div class="login-container">
    <h1>Admin Login</h1>
    <form on:submit={handleLogin}>
      <label for="username-input">Username</label>
      <input id="username-input" bind:value={username} type="text" />
      <label for="password-input">Password</label>
      <input id="password-input" bind:value={password} type="password" />
      <button class="login-btn">Login</button>
    </form>
    <p class="error-message">{loginMessage}</p>
  </div>
</div>
