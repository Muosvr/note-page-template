<script lang='ts'>
  import { onMount } from "svelte";
  import { saveInnerHTML } from "../actions";
  import { store, dispatchToStore } from "../stores";

  export let elementId: string;

  let quillContainer: Element;
  let htmlContainer: Element;
  let innerHTML: string = $store.elementProps[elementId].html;
  let editor: any;
  let qlEditor: boolean = false;

  const toolbarOptions = [
    { font: [] },
    { header: [] },
    { align: [] },
    "strike",
    "italic",
    "underline",
    "blockquote",
    "code-block",
    "link",
    "image",
    { color: []},
    { list: "bullet" },
    { list: "ordered" },
  ];

  const options = {
    placeholder: "Compose an epic...",
    modules: {
      toolbar: toolbarOptions,
    },
    theme: "bubble",
  };

  onMount(async () => {
    let Quill = await import("quill");
    Quill = Quill.default;

    // Remove the placeholder ql-editor before quill initiate
    htmlContainer = quillContainer.getElementsByClassName("ql-editor")[0];
    quillContainer.innerHTML = htmlContainer.innerHTML;

    // Initiate quill
    editor = new Quill(quillContainer, options);
    htmlContainer = quillContainer.getElementsByClassName("ql-editor")[0];

    editor.on("text-change", () => {
      dispatchToStore(
        saveInnerHTML({ elementId, html: htmlContainer.innerHTML })
      );
    });
  });

  $: if (editor){
    if($store.pageProps.editingLayout) {
      editor.enable();
    }else {
      editor.enable(false)
    }
  }
</script>

<div
  style="border: none;"
  class="ql-container ql-bubble"
  class:ql-editor={qlEditor}
  bind:this={quillContainer}
>
  <div class="ql-editor">
    {@html innerHTML}
  </div>
</div>
