<script lang="ts">
  import { uploadFile } from "../ajax";
  import { store, dispatchToStore } from "../stores";
  import { updateImageSrc } from "../actions";

  export let elementId: string;
  // export let csrf: string;

  let image: HTMLImageElement;
  let input: HTMLInputElement;
  let src: string;

  const handleUpload = (): void => {
    if (input.files && input.files[0]) {
      image.src = URL.createObjectURL(input.files[0]);
      image.onload = handleImageLoaded;
    }
  };

  const handleImageLoaded = (): void => {
    uploadFile({ file: input.files[0] })
      .then((res) => {
        dispatchToStore(updateImageSrc({ src: res.data.data.url, elementId }));
      })
      .catch(() => console.log("handleImageLoaded: failed to upload to host"));
  };

  $: src = $store.elementProps[elementId].src;
</script>

<style>
  img {
    width: 100%;
    /* padding: 15px; */
    /* margin: 0 -15px; */
  }
  .image-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    /* margin: 15px; */
    padding: 15px;
    overflow: hidden;
    box-sizing: border-box;
  }
  input {
    border: none;
    margin: auto;
    width: 220px;
  }
  /* .image-sub-container {
    width: 100%;
  } */
</style>

<div class="image-container">
  {#if src}
    <img {src} alt="" bind:this={image} />
  {:else}<input type="file" bind:this={input} on:change={handleUpload} />{/if}
</div>
