<script context='module' lang='ts'>
  export async function preload(page, session) {

    let type: 'login' | 'register' = page.params.type;
    if (!['login', 'register'].includes(type)){
      this.error(404, 'Not found');
    };

    const { user, csrf } = session || {};
    if (user) {
      return this.redirect(302, '/');
    }

    let githubClientId;
    try{
      githubClientId = process.env.GITHUB_CLIENT_ID
    }catch {}
    
    return { csrf, type, githubClientId }
  }
</script>

<script lang='ts'>
  import { register, login, setGlobalCsrf } from '../../ajax';
  
  export let csrf: string;
  export let type: 'login' | 'register';
  export let githubClientId;

  setGlobalCsrf(csrf);

  const formProps = {
    login: {
      h1: 'Log In',
      buttonText: 'Login',
      handleSubmit: login,
    },
    register: {
      h1: 'Register for an account',
      buttonText: 'Register',
      handleSubmit: register,
    }
  }

  const props = formProps[type]

  const scope = 'user repo';
  const GITHUB_AUTH_URL = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&scope=${scope}`;
    
  let username: string;
  let password: string;
  let errorMsg: string;

  const handleSubmit = (e: Event):void => {
    e.preventDefault();
    props.handleSubmit({ username, password, csrf })
      .then(user => {
        console.log('redirecting to ', `/`)
        window.location.assign(`/`);
      })
      .catch(err => errorMsg = err.response.data.error);
  }

  const githubAuth = () => {
    window.location.assign(GITHUB_AUTH_URL);
  }
</script>

<style>
  .input-container{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: thistle;
    flex-direction: column;
  }
  .panel {
    background-color: rgb(133, 192, 192);
    padding: 30px;
    width: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .input-container:after{
    content: 'foo';
    visibility: hidden;
    height: 200px;
  }
  h1 {
    margin-top: 0;
  }
  form {
    display: flex;
    flex-direction: column;
  }
  .submit-btn {
    margin-top: 10px;
    width: 80px;
  }
  .capitalize {
    text-transform: capitalize;
  }
  .error {
    color: red;
  }
</style>

<div class='input-container'>
  <div class='panel'>
    <h1>{props.h1}</h1>
    {#if errorMsg }
    <p class='error'>{errorMsg}</p>
    {/if}
    <form on:submit={handleSubmit}>
      <label for='username-input'>Username</label>
      <input id='username-input' type='text' bind:value={username} required/>
      <label for='password-input-1'>Password</label>
      <input id='password-input-1' type='password' bind:value={password} required/>
      <input hidden value={csrf} />
      <button class='capitalize submit-btn' >{props.buttonText}</button>
    </form>
    <br/>
    <button on:click={githubAuth}>Sign In with Github</button>
  </div>

</div>