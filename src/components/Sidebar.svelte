<script lang='ts'>
  import { store } from '../stores';
  import MenuSettings from './settings/MenuSettings/index.svelte';
  import BlockSettings from './settings/BlockSettings/index.svelte';
  import SidebarSettings from './settings/SidebarSettings.svelte';
  import type { State, SingleElementProps } from '../types';

  const selectElementId = (store: State): string => {
    let blockId:string = (store.pageProps.focusedBlock||{}).id;
    if (store.blockProps[blockId]){
      return (store.blockProps[blockId].elements || [undefined])[0];
    }
  }

  const selectElementProps = (store: State): SingleElementProps => {
    let elementId: string = selectElementId(store);
    if (!elementId){
      return;
    }
    return store.elementProps[elementId];
  }

</script>

<style>
  .element-title {
    margin-bottom: 0px;
  }
</style>


<SidebarSettings>
  {#if selectElementProps($store)}
    <BlockSettings />
    <h3 class='element-title'>Element Settings</h3>
    {#if selectElementProps($store).type === 'menu'}
      <MenuSettings elementId={selectElementId($store)} />
    {/if}
  {:else}
      Select a block to change its settings
  {/if}
</SidebarSettings>

