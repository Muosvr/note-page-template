<script lang='ts'>
  import { onMount } from "svelte";
  import Divider from "../Divider.svelte";
  import Element from "../Element.svelte";
  import { levelConfig } from "../../stores";
  import { store, dispatchToStore } from "../../stores";
  import { focusBlock, createBlockChild } from "../../actions";
  import type { SingleBlockProps, State, BackgroundImage } from '../../types';
  import { selectBackgroundImage, selectBackgroundColor } from '../../selectors';

  export let level: number = 0;
  export let id: string = "root";
  export let hideFirstDivider = false;

  let container: any;
  let hidden: boolean = true;
  let backgroundImage: BackgroundImage;
  let root: boolean;
  let block: any;
  // let backgroundColor: string;

  $: backgroundImage = selectBackgroundImage($store, id);
  // $: backgroundColor = selectBackgroundColor($store, id);

  // $: if (container && block && $store.blockIds['root'][0] === id && block.offsetWidth){
  //   //@ts-ignore
  //   container.style.width = String(block.offsetWidth + 30) + 'px' ;
  //   container.style['margin-left'] = '-15px';
  //   container.style['margin-right'] = '-10px';
  // }

  const createChild = (index?:number) => {
    createBlockChild(id, index);
  };

  const getLevelConfig = ( level: number ): any => $levelConfig[level] || $levelConfig.default;

  onMount(() => {
    block = document.getElementsByClassName('block')[0];
    let props: SingleBlockProps = $store.blockProps[id];
    if (props.height) {
      container.style.height = props.height;
    }
    if (props.vertical) {
      container.style["flex-direction"] = "column";
    }
    hidden = false;

    if (backgroundImage) {
      let imageProps: BackgroundImage = $store.blockProps[id].backgroundImage;
      setBackgroundImage(imageProps.url, imageProps.size, imageProps.position)
    }

    // if ($store.blockIds['root'][0] === id) {
    //   console.log('hidding divider')
    //   hideFirstDivider = true;
    //   container.style['margin-left'] = '-15px';
    //   container.style['margin-right'] = '-10px';
    //   let block = document.getElementsByClassName('block')[0];

    //   //@ts-ignore
    //   container.style.width = String(block.offsetWidth + 30) + 'px' ;
    // }
    if (id === 'root') {
      root = true;
    }
    
  });

  $: if ((backgroundImage || {}).reload && container) {
    let imageProps: BackgroundImage = $store.blockProps[id].backgroundImage;
    setBackgroundImage(imageProps.url, imageProps.size, imageProps.position)
  }

  $: {
    let backgroundColor = selectBackgroundColor($store, id);
    if (container) {
      setBackgroundColor(backgroundColor);
    }
  }

  const setBackgroundImage = (
    url:string, 
    size: string = 'cover', 
    position: string = 'center'
  ): void => {
    container.style['background-image'] = url? `url("${url}")` : '';
    container.style['background-size'] = size
    container.style['background-position'] = position;
  }

  const setBackgroundColor = (color: string= undefined): void => {
    container.style['background-color'] = color;
  }

  const shouldHideControl = ( store: State ): boolean => {
    if (hasChildren(store) || !store.pageProps.editingLayout) return true;
  };

  const hasChildren = ( store: State ): boolean => {
    if (store.blockIds) {
      return store.blockIds[id].length > 0;
    }
  };

  const selectBlockIds = ( store: State ): string[] => {
    return store.blockIds[id];
  };

  const handleFocus = (e: Event):void => {
    e.stopPropagation();
    if ($store.pageProps.editingLayout) {
      dispatchToStore(focusBlock({ id }));
    }
  };

  const isInFocus = (store: State): boolean => (store.pageProps.focusedBlock || {}).id === id
</script>

<style type="text/less">
  .container {
    display: flex;
    position: relative;
    flex: 1;
    align-items: stretch;
    width: 100%;
    opacity: 100%;
    transition: opacity 0.5s;
  }
  .shadow {
    // box-shadow: 0 0px 0px 1px rgb(153, 153, 153);
    border-radius: 3px;
    border: 1px dashed rgb(153, 153, 153);
  }

  @media screen and (max-width: 600px) {
    .container {
      flex-direction: column;
    }
  }
  .elements-container {
    height: 100%;
    width: 100%;
  }

  .elements-container {
    display: block;
    width: 100%;
  }
  .focused {
    z-index: 5;
  }
  .focused::before {
    content: ".";
    color: transparent;
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    border-radius: 3px;
    border: 2px solid white;
    box-shadow: 0 0 0 2px black;
    pointer-events: none;
  }
  .hidden {
    opacity: 0%;
  }
</style>

{#if getLevelConfig(level).headDivider && !hideFirstDivider}
  <!-- <Divider 
    horizontal={true} 
    createChild={() => createChild(0)} 
  /> -->
{/if}
<div
  class="container"
  class:shadow={!shouldHideControl($store)}
  class:focused={isInFocus($store)}
  class:hidden
  class:root
  bind:this={container}
  on:click={handleFocus}>
  {#if selectBlockIds($store).length == 0}
    <div class="elements-container">
      {#each $store.blockProps[id].elements as elementId (elementId)}
        <Element id={elementId} />
      {/each}
    </div>
  {/if}
  {#each selectBlockIds($store) as childId, index (childId)}
    <svelte:self level={level + 1} id={childId} />
    {#if index !== selectBlockIds($store).length - 1}
      {#if level % 2 == 0}
        <Divider horizontal={true} createChild={() => createChild(index + 1)} />
      {:else}
        <Divider createChild={() => createChild(index + 1)} />
      {/if}
    {/if}
  {/each}
</div>
{#if getLevelConfig(level).tailDivider}
  <Divider
    alwaysShow
    horizontal={true}
    createChild={() => createChild(selectBlockIds($store).length)} />
{/if}
