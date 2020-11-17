import blockReducer from './blockReducer';
import pageReducer from './pageReducer';
import initState from './initState';

import type { 
  State, 
  Action, 
  BlockState,
  PageState
} from '../types';

const rootReducer = ( action: Action, state: State ): State => {
  const blockState: BlockState = {
    blockProps: state.blockProps,
    elementProps: state.elementProps,
    blockIds: state.blockIds
  };
  const newBlockState: BlockState = blockReducer(action, blockState);

  const pageState: PageState = {
    pageProps: state.pageProps,
    saved: state.saved,
    published: state.published
  };

  const newPageState = pageReducer(action, pageState);

  return {
    blockIds: newBlockState.blockIds,
    blockProps: newBlockState.blockProps,
    elementProps: newBlockState.elementProps,
    pageProps: newPageState.pageProps,
    saved: newPageState.saved,
    published: newPageState.published,
    pageId: state.pageId
  };
}

export { initState,  rootReducer };
