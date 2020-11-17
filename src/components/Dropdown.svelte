<script>
  import { onMount, createEventDispatcher } from 'svelte';
  // export let selected;
  export let left;
  export let top;
  let dropdown;
  let input;
  let input_value = '';
  let dropdownContainer;

  const dispatch = createEventDispatcher();
  const optionData = [
    {value: 'button', text: 'button'},
    {value: 'input', text: 'input'},
    {value: 'text', text: 'text'},
    {value: 'image', text: 'image'},
    {value: 'title', text: 'title'},
    {value: 'header', text: 'header'},
    {value: 'block', text: 'block'},
    {value: 'quill', text: 'quill'},
  ]

  /* When the user clicks on the button,
  toggle between hiding and showing the dropdown content */
  // function myFunction() {
  //   document.getElementById('myDropdown').classList.toggle('show');
  // }

  const handleInput = e => {
    if (e.code.toLowerCase() === 'enter') {
      let filter = input_value.toUpperCase();
      let options = dropdown.getElementsByClassName('dropdown-option');
      for (let i = 0; i < options.length; i++) {
        if (options[i].style.display !== 'none'){
          // selected = options[i].value;
          dispatch('select', options[i].value);
          return;
        }
      }
    }
    filterFunction();
  }

  function filterFunction() {
    let filter = input_value.toUpperCase();
    let options = dropdown.getElementsByClassName('dropdown-option');
    for (let i = 0; i < options.length; i++) {
      let txtValue = options[i].value || options[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        options[i].style.display = '';
      } else {
        options[i].style.display = 'none';
      }
    }
  }

  onMount(() => {
    document.getElementById('myInput').focus();
    if (left && top) {
      dropdownContainer.style.left = left + 'px';
      dropdownContainer.style.top = top + 'px';
    };
  });

  const handleSelect = (value) => {
    // selected = value;
    dispatch('select', value);
  }
</script>

<style>
  /* The search field */
  #myInput {
    box-sizing: border-box;
    /* background-image: url('searchicon.png'); */
    background-position: 14px 12px;
    background-repeat: no-repeat;
    font-size: 16px;
    padding: 14px 20px 12px 10px;
    border: none;
    border-bottom: 1px solid #ddd;
  }

  /* The search field when it gets focus/clicked on */
  #myInput:focus {outline: 3px solid #ddd;}

  /* The container <div> - needed to position the dropdown content */
  .dropdown {
    position: absolute;
    display: inline-block;
    /* left: {left};
    top: 54px; */
    z-index: 1;
  }

  /* Dropdown Content (Hidden by Default) */
  .dropdown-content {
    display: none;
    position: relative;
    background-color: #f6f6f6;
    min-width: 230px;
    border: 1px solid #ddd;
    /* z-index: 1; */
    /* left:20px; */
  }

  /* Links inside the dropdown */
  .dropdown-content option {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
  }

  /* Change color of dropdown links on hover */
  .dropdown-content option:hover {background-color: #f1f1f1}

  /* Show the dropdown menu (use JS to add this class to the .dropdown-content container when the user clicks on the dropdown button) */
  .show {display:block;}

  .dropdown-option {
    text-align: left;
  }
</style>

<div class='dropdown' bind:this={dropdownContainer}>
  <div id='myDropdown' class='dropdown-content show' bind:this={dropdown}>
    <input 
      type='text' 
      placeholder='Search..' 
      id='myInput' 
      on:keyup ={handleInput}
      bind:this={input}
      bind:value={input_value}
    >
    {#each optionData as option}
      <option 
        class='dropdown-option' 
        value={option.value}
        on:click={() => handleSelect(option.value)}
      >{option.text}</option>
    {/each}
  </div>
</div>