<script lang="ts">
  import { uploadFile } from "../ajax";
  import { store, dispatchToStore } from "../stores";
  import { updateImageSrc } from "../actions";
  import { onMount } from "svelte";

  export let elementId: string;
  // export let csrf: string;

  let image: HTMLImageElement;
  let input: HTMLInputElement;
  let hideInput: boolean = false;
  let hideImage: boolean = true;

  const handleUpload = (): void => {
    if (input.files && input.files[0]) {
      image.src = URL.createObjectURL(input.files[0]);
      image.onload = handleImageLoaded;
    }
  };

  const handleImageLoaded = (): void => {
    hideInput = true;
    hideImage = false;
    uploadFile({ file: input.files[0] })
      .then((res) => {
        dispatchToStore(updateImageSrc({ src: res.data.data.url, elementId }));
      })
      .catch(() => console.log("handleImageLoaded: failed to upload to host"));
  };

  onMount(() => {
    let source: string = $store.elementProps[elementId].src;
    if (source) {
      image.src = source;
      hideImage = false;
      hideInput = true;
    }
  });
</script>

<style>
  img {
    width: 100%;
  }
  .image-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  input {
    border: none;
    margin: auto;
    width: 220px;
  }
  .hideInput,
  .hideImage {
    display: none;
  }
</style>

<div class="image-container">
  <input
    type="file"
    bind:this={input}
    on:change={handleUpload}
    class:hideInput />
  <img src="#" alt="" bind:this={image} class:hideImage />
</div>
