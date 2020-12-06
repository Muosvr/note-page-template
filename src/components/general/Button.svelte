<script lang="ts">
  export let text: string;
  export let loadingText = "Loading...";
  export let loading = false;
  export let disabled = false;
  export let disableDuringLoad = false;
</script>

<style>
  button {
    cursor: pointer;
  }
</style>

<button
  disabled={disabled || (disableDuringLoad && loading)}
  on:click>{loading ? loadingText : text}</button>
