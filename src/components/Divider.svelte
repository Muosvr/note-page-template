<script lang='ts'>
  import PlusBtn from "../graphics/PlusBtn.svelte";
  import { store } from "../stores";
  
  export let horizontal: boolean = false;
  export let alwaysShow: boolean = false;
  export let createChild:() => void;

  const handleCreateChild = (e: Event): void => {
    e.stopPropagation();
    createChild();
  }
</script>

<style type="text/less">
  .divider {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0%;
    transition: 0.5s;
  }
  .vertical {
    width: 10px;
    transition: width 0.5s;
    min-height: 10px;
  }
  .horizontal {
    height: 10px;
    transition: height 0.5s;
    min-width: 10px;
  }

  .vertical:hover.active {
    width: 50px;
    opacity: 100%;
    transition: 0.5s;
    transition-delay: 0.2s;
  }
  .horizontal:hover.active {
    height: 50px;
    opacity: 100%;
    transition: 0.5s;
    transition-delay: 0.2s;
  }
  .alwaysShow {
    opacity: 100%;
    height: 70px;
    margin-bottom: 500px;
  }
</style>

{#if horizontal}
  <div
    class="horizontal divider"
    class:active={$store.pageProps.editingLayout && !alwaysShow}
    class:alwaysShow={alwaysShow && $store.pageProps.editingLayout}>
    <PlusBtn
      onClick={handleCreateChild}
      opaque
      hidden={!$store.pageProps.editingLayout} />
  </div>
{:else}
  <div class="vertical divider" class:active={$store.pageProps.editingLayout}>
    <PlusBtn
      onClick={handleCreateChild}
      opaque
      hidden={!$store.pageProps.editingLayout} />
  </div>
{/if}
