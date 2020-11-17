<script lang='ts'>
  import { store, dispatchToStore } from "../stores";
  import { changeElementType } from "../actions";
  import QuillText from "./QuillText.svelte";
  import Image from "./Image.svelte";
  import Menu from './Menu.svelte';

  export let id: string;

  let selected: string = $store.elementProps[id].type;

  const changeType = (type: string): void => {
    dispatchToStore(changeElementType({ id, type }));
    selected = type;
  };
</script>

<style type="text/less">
  .block-types-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px 5px;
    flex-wrap: wrap;
    button {
      margin: 5px;
    }
  }
  .select-button {
    border: 1px dashed grey;
    background-color: white;
    color: rgb(88, 88, 88);
    cursor: pointer;
  }
  .select-button:hover {
    color: black;
    border: 1px dashed black;
  }
</style>

{#if !selected}
  <div class="block-types-container">
    <button
      class='select-button'
      on:click={() => changeType('image')}>Image</button>
    <button 
      class='select-button'
      on:click={() => changeType('quill')}>Text & Image</button>
    <button 
      class='select-button'
      on:click={() => changeType('menu')}>Menu</button>
  </div>

{:else if selected === 'input'}
  <input type="text" />
{:else if selected === 'image'}
  <Image elementId={id} />
{:else if selected === 'quill'}
  <QuillText elementId={id} />
{:else if selected === 'menu'}
  <Menu elementId={id}/>
{/if}
