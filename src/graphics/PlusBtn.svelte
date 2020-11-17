<script lang='ts'>
  export let hidden: boolean = false;
  export let position: string = '';
  export let opaque: boolean = false;
  export let transparent: boolean = false;
  export let onClick: (e?:Event) => any;

</script>

<style type="text/less">
  .plus-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    z-index: 10;
    box-shadow: 0px 0px 5px 1px rgb(172, 172, 172);
    padding: 7px;
    border-radius: 50%;
    width: 22px;
    height: 22px;
    background-color: white;
    opacity: 100%;
    cursor: pointer;
  }
  .transparent {
    opacity: 0%;
  }
  .opaque {
    opacity: 100%;
  }
  .plus-btn:hover {
    opacity: 100%;
    box-shadow: 0px 0px 9px 1px rgb(172, 172, 172);
    transition: 0.5s;
  }
  .plus-btn:active {
    box-shadow: 0px 0px 2px rgb(122, 122, 122);
    background-color: rgb(247, 247, 247);
  }
  .hidden {
    display: none;
  }
  .right {
    right: 30px;
    top: 50%;
    transform: translate(0, -50%);
  }
  .bottom {
    bottom: 10px;
    left: 50%;
    transform: translate(-50%, 0);
  }
  img {
    width: 25px;
  }
</style>

<div
  class="plus-btn"
  class:hidden
  class:right={position === 'right'}
  class:bottom={position === 'bottom'}
  class:transparent
  class:opaque
  alt="add block"
  on:click={onClick}>
  <img src="plus-3.svg" alt="plus button" />
</div>
