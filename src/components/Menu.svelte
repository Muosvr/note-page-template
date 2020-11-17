<script lang='ts'>
  import { store, dispatchToStore } from '../stores';
  import { saveMenu } from '../actions';
  import type { State } from '../types';
  import type { MenuData, LogoData } from '../types';
  import { selectLogoData } from '../selectors';

  export let elementId: string;

  let openMenu: boolean = false;
  let rightMenu: Element;
  let showToolbar: boolean = false;
  let logoData: LogoData;
  let menuData: MenuData;

  const DEFALT_MENU_DATA: MenuData = [
    { href: '#', text: 'Products'},
    { href: '#', text: 'Pricing'},
    { href: '#', text: 'Contact'},
  ]

  const DEFAULT_LOGO_DATA: LogoData = {
    name: 'Home',
    href: '/',
  }

  const selectMenuData = (store: State): MenuData => (store.elementProps[elementId] || {}).menuData;

  if (!selectMenuData($store)){
    dispatchToStore(saveMenu({elementId, menuData:DEFALT_MENU_DATA, logoData: DEFAULT_LOGO_DATA}))
  }

  $: showToolbar = $store.pageProps.showToolbar;
  $: logoData = selectLogoData($store, elementId);
  $: menuData = selectMenuData($store);
  
</script>

<style>
  .menu {
    padding: 10px;
    display:flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
  }
  .menu-item {
    padding: 5px;
    color: black;
  }

  .hamburger {
    display: none;
    cursor: pointer;
    float: right;
    margin:auto 0;
    padding: 10px;
    height: 28px;
  }

  .logo {
    display: inline-block;
    margin-top: auto;
    margin-bottom: auto;
    color: black;
  }


  @media screen and (max-width: 600px){
    .right-menu { 
      display: none;
      float: none;
    }
    .hamburger { 
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      float:none;
    }
    .menu {
      height: auto;
      position: relative;
      display: block;
    }
    .menu-item {
      padding-left: 0px;
    }
    .openMenu {
      display: block;
    }
    .logo {
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  @media screen and (max-width: 866px){
    .showToolbar.right-menu { 
      display: none;
      float: none;
    }
    .showToolbar.hamburger { 
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      float:none;
    }
    .showToolbar.menu {
      height: auto;
      position: relative;
      display: block;
    }
    .showToolbar.menu-item {
      padding-left: 0px;
    }
    .showToolbar.openMenu {
      display: block;
    }
    .logo {
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  .place-holder {
    visibility: hidden;
  }
</style>

<nav class='menu' class:showToolbar>
  {#if logoData && logoData.name}
    {#if logoData.name}
    <a href={logoData.href}>
      <h1 class='logo' >{logoData.name}</h1>
    </a>
      
    {/if}
  {:else}
    <h1 class='place-holder logo'>PlaceHolder</h1>
  {/if}

    <img
      on:click={() => openMenu = !openMenu} 
      class='hamburger'
      class:showToolbar
      src='menu.svg' 
      alt='menu'
    />
  <div 
    class='right-menu' 
    class:openMenu 
    class:showToolbar
    bind:this={rightMenu}
  >
    {#each menuData || [] as item, index (index)}
      <a
        class='menu-item'
        class:openMenu
        class:showToolbar
        href={item.href}
      >{item.text}</a>
    {/each}
  </div>

</nav>