<script lang='ts'>
  let editing: boolean = false;
  export let text: string;
  export let href: string;
  export let index: number;
  export let handleDelete: (number) => void;
  export let handleUpdate: () => void;

</script>
<style>
  .item-container {
    border: 1px solid grey;
    padding: 5px;
    margin-bottom: 5px;
    display:flex;
    align-items: center;
    justify-content: space-between;
  }
  button {
    margin:0;
    margin-left: 10px;
  }
  .edit-panel {
    flex-direction: column;
  }
  input {
    width: 100%;
  }
  .edit-panel > button {
    margin: 0;
  }
</style>

<div class='item-container'>
  {#if editing}
    <div class='edit-panel'>
      <label for={'item-text-'+index}>Name</label>
      <input id={'item-text-'+index} bind:value={text} />
      <label for={'item-href-'+index}>Link</label>
      <input id={'item-href-'+index} bind:value={href} />
      <button
        on:click={() => {
            editing = false;
            handleUpdate();
          }
        }
      >Done</button>
    </div>
  {:else}
    <span>{text}</span>
    <div class='button-container'>
      <button
        on:click={() => editing = true}
      >Edit</button>
      <button
        on:click={() => handleDelete(index)}
      >Delete</button>
    </div>

  {/if}
</div>
