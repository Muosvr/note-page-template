<script lang="ts">
  import { dispatchToStore, store } from "../../../stores";
  import {
    selectFocusedBlockVertical,
    selectFocusedBlockId,
  } from "../../../selectors";
  import {
    handleAddBlock,
    handleDeleteBlock,
    setBackgroundImage,
    setBackgroundColor,
  } from "../../../actions/";
  import BreadCrumbs from "./BreadCrumbs.svelte";
  import { uploadFile } from "../../../ajax";

  let imageInput: HTMLInputElement;
  let focusedBlock: string;
  let backgroundColor: string = "#000000";

  $: {
    focusedBlock = selectFocusedBlockId($store);
  }

  const handleAdd = (): void => {
    // let focusedBlock: string = selectFocusedBlockId($store);
    handleAddBlock(focusedBlock, $store);
  };

  const handleDelete = (): void => {
    // let focusedBlock: string = selectFocusedBlockId($store);
    handleDeleteBlock(focusedBlock);
  };

  const handleUpload = (): void => {
    if (imageInput.files && imageInput.files[0]) {
      let tempUrl = URL.createObjectURL(imageInput.files[0]);
      console.log("tempUrl", tempUrl);
      dispatchToStore(
        setBackgroundImage({
          blockId: focusedBlock,
          url: tempUrl,
          reload: true,
        })
      );
      console.log("blockProps", $store.blockProps[focusedBlock]);
      uploadFile({ file: imageInput.files[0] })
        .then((res) => {
          dispatchToStore(
            setBackgroundImage({
              blockId: focusedBlock,
              url: res.data.data.url,
            })
          );
        })
        .catch(() => console.log("handleUpload: failed to upload to host"));
    }
  };

  const handleResetBackground = (): void => {
    dispatchToStore(
      setBackgroundImage({ blockId: focusedBlock, reload: true })
    );
    dispatchToStore(setBackgroundColor({ blockId: focusedBlock, color: "" }));
  };

  const handleChangeBackgroundColor = (): void => {
    dispatchToStore(
      setBackgroundColor({ blockId: focusedBlock, color: backgroundColor })
    );
  };
</script>

<style>
  input {
    width: 100%;
  }
  #background-color-picker {
    width: 300px;
    height: 40px;
    margin-bottom: 0;
  }
  .color-picker-btn {
    height: 40px;
    margin-bottom: 0;
    margin-left: 10px;
    width: 100%;
  }
  .color-setting-container {
    display: flex;
    align-items: center;
  }
  label {
    margin-bottom: 5px;
  }
  .reset-background {
    margin-top: 10px;
  }
</style>

<h3>Block Settings</h3>
<BreadCrumbs />
<button on:click={() => handleAdd()}>
  {selectFocusedBlockVertical($store) ? 'Split Vertically' : 'Split Horizontally'}
</button>
<button on:click={() => handleDelete()}> Delete Block</button>
<div class="input-container">
  <label for="background-image-upload">Background Image</label>
  <input
    bind:this={imageInput}
    type="file"
    id="background-image-upload"
    on:change={handleUpload} />
  <label for="background-color-picker">Background Color</label>
  <div class="color-setting-container">
    <input
      id="background-color-picker"
      type="color"
      bind:value={backgroundColor} />
    <button
      on:click={handleChangeBackgroundColor}
      class="color-picker-btn">Set</button>
  </div>
</div>

<button on:click={handleResetBackground} class="reset-background">Reset
  Background</button>
