<script lang='ts'>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let hidden: boolean = false;
</script>

<style>
  .container {
    z-index: 1;
    position: absolute;
    top: 5px;
    right: 5px;
    width: 28px;
    height: 28px;
    border-radius: 14px;
    opacity: 20%;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .container:hover {
    opacity: 90%;
  }
  .hidden {
    display: none;
  }
</style>

<div class="container" class:hidden on:click={() => dispatch('click')}>
  <img src="trash.svg" alt="trash" />
</div>
