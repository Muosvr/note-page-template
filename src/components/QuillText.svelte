<script lang="ts">
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
    { header: [1, 2, 3, false] },
    { size: [] },
    { align: [] },
    "strike",
    "italic",
    "underline",
    "blockquote",
    "code-block",
    "link",
    "image",
    { color: [] },
    { list: "bullet" },
    { list: "ordered" },
  ];

  const options = {
    placeholder: "",
    modules: {
      toolbar: toolbarOptions,
    },
    theme: "bubble",
  };

  onMount(async () => {
    let Quill = await import("quill");
    // let Font = await import("quill/formats/font");
    // Font.whitelist = ["mirza", "roboto"];
    // Quill.default.register(Font, true);
    let QuillEditor = Quill.default;
    let Font = QuillEditor.import("formats/font");
    Font.whitelist = ["roboto"];
    QuillEditor.register(Font, true);

    // Remove the placeholder ql-editor before quill initiate
    htmlContainer = quillContainer.getElementsByClassName("ql-editor")[0];
    quillContainer.innerHTML = htmlContainer.innerHTML;

    // Initiate quill
    editor = new QuillEditor(quillContainer, options);
    htmlContainer = quillContainer.getElementsByClassName("ql-editor")[0];

    editor.on("text-change", () => {
      dispatchToStore(
        saveInnerHTML({ elementId, html: htmlContainer.innerHTML })
      );
    });
  });

  $: if (editor) {
    if ($store.pageProps.editingLayout) {
      editor.enable();
    } else {
      editor.enable(false);
    }
  }
</script>

<div
  style="border: none;"
  class="ql-container ql-bubble"
  class:ql-editor={qlEditor}
  bind:this={quillContainer}>
  <div class="ql-editor">
    {@html innerHTML}
  </div>
</div>
