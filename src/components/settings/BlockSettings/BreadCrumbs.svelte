<script lang='ts'>
import { store, dispatchToStore } from "../../../stores";
import { 
  selectParentLagecy,
  selectBlockParent,
  selectFocusedBlockId
} from "../../../selectors";
import { focusBlock } from "../../../actions";
import type { State } from "../../../types";

  const handleSelectParent = (store: State): void => {
    let focusedBlock: string = selectFocusedBlockId(store);
    let parent: string = (
        selectBlockParent({store, blockId: focusedBlock}) || selectParentLagecy({store, blockId: focusedBlock})
      );
    dispatchToStore(focusBlock({id: parent}));
  }

</script>
<button on:click={() => handleSelectParent($store)}>Select Parent</button>


