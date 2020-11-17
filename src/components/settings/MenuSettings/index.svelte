<script lang='ts'>
  import { store, dispatchToStore } from '../../../stores';
  import { saveMenu } from '../../../actions';
  import MenuItem from './MenuItem.svelte';
  import type { MenuData, LogoData } from '../../../types';
  import { selectLogoData } from '../../../selectors';

  export let elementId: string;

  let menuData: MenuData;

  let logoData: LogoData = selectLogoData($store, elementId);
  let logoName: string = logoData? logoData.name : '';
  let logoHref: string = logoData? logoData.href : '';

  $: menuData = $store.elementProps[elementId].menuData || [];

  const handleUpdate = ():void => {
    logoData = { ...logoData, name: logoName, href: logoHref }
    save();
  }
  const save = ():void => {
    dispatchToStore(saveMenu({ elementId, menuData, logoData }));
  }

  const handleAdd = (): void => {
    menuData = [
      ...menuData, 
      {
        text: 'New Item', 
        href:'', 
      }
    ]
    save();
  }

  const handleDelete = (index: number): void => {
    menuData = menuData.filter((_, i) => i !== index);
    save();
  }

</script>

<style>
  #logo-image-upload {
    width: 100%;
  }
</style>


<p>Logo</p>
  <label for='logo-name-input'>Name</label>
  <input 
    id='logo-name-input' 
    type='text' 
    bind:value={logoName}
    on:keyup={handleUpdate}
  >
  <label for='logo-href'>Link</label>
  <input
    id='logo-href'
    type='text'
    bind:value={logoHref}
    on:keyup={handleUpdate}
  >
  <div class='logo-image-upload-container'>
    <label for='logo-image-upload'>Image</label>
    <input id='logo-image-upload' type=file />
  </div>

<p>Links</p>
{#each menuData as item, index (index)}
  <MenuItem 
    bind:text={item.text}
    bind:href={item.href}
    handleUpdate={handleUpdate}
    handleDelete={handleDelete}
    index={index}
  />
{/each}
<button on:click={() => handleAdd()}>Add</button>

