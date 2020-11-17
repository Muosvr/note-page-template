import {
  ADD_CHILD_BLOCK,
  ADD_ELEMENT,
  CHANGE_ELEMENT_TYPE,
  SAVE_ELEMENT_CONTENT,
  SAVE_QUILL_INNERHTML,
  DELETE_BLOCK,
  LOAD_STORE,
  TOGGLE_EDIT_LAYOUT,
  TOGGLE_EDIT_TEXT,
  FOCUS_BLOCK,
  UPDATE_IMAGE_SRC,
  SET_STORE_SAVED,
  SAVE_MENU,
  TOGGLE_TOOLBAR,
  SET_BACKGROUND_IMAGE,
  SET_BACKGROUND_COLOR,
  SET_DATA_SOURCES,
  TOGGLE_PUBLISH_PAGE,
} from './constants';
import type { 
  MenuData, 
  LogoData, 
  Action, 
  State, 
  DataSources
} from '../types';
import { dispatchToStore } from '../stores';
import { v4 as uuid } from 'uuid';

export const addChildBlock = ({ 
  parentId, index, newChildId, newElementId 
}:{
  parentId: string, 
  index?: number, 
  newChildId: string, 
  newElementId: string
}): Action => {
  return {
    type: ADD_CHILD_BLOCK,
    payload: {
      parentId,
      index,
      newChildId,
      newElementId
    },
  };
};

export const addElement = ({
   type, blockId, index 
  }: { type: string, blockId: string, index?: number
  }): Action => {
  return {
    type: ADD_ELEMENT,
    payload: { type, blockId, index },
  };
};

export const changeElementType = ({ id, type }:{ id: string, type: string }): Action => {
  return {
    type: CHANGE_ELEMENT_TYPE,
    payload: { type, id },
  };
};

export const saveElementContent = ({ id, content }: { id: string, content: string }): Action => {
  return {
    type: SAVE_ELEMENT_CONTENT,
    payload: { id, content },
  };
};

export const saveInnerHTML = ({ elementId, html }: {elementId: string, html: string}): Action => {
  return {
    type: SAVE_QUILL_INNERHTML,
    payload: { elementId, html },
  };
};

export const deleteBlock = ({ id }: { id: string }): Action => {
  return {
    type: DELETE_BLOCK,
    payload: { id }
  };
};

export const loadStore = ({ data }: { data: State}): Action => {
  return {
    type: LOAD_STORE,
    payload: { data }
  };
};

export const toggleEditLayout = (): Action => {
  return {
    type: TOGGLE_EDIT_LAYOUT,
  };
}

export const toggleEditText = (): Action => {
  return {
    type: TOGGLE_EDIT_TEXT,
  };
};

export const focusBlock = ({ id }: { id: string }): Action => {
  return {
    type: FOCUS_BLOCK,
    payload: { id }
  };
};

export const updateImageSrc = ({ src, elementId }: { src: string, elementId: string }): Action => {
  let payload: { src: string, elementId: string } = { src, elementId }
  return {
    type: UPDATE_IMAGE_SRC,
    payload
  };
};

export const setBackgroundImage = (
  { blockId, url, reload }: { blockId: string, url?: string, reload?: boolean}
): Action => {
 return {
   type: SET_BACKGROUND_IMAGE,
   payload: {
     blockId,
     url,
     reload
   }
 }
}

export const setBackgroundColor = (
  { blockId, color }: { blockId: string, color?: string }
): Action => {
  return {
    type: SET_BACKGROUND_COLOR,
    payload: {
      blockId,
      color
    }
  }
}

export const setStoreSaved = (): Action => {
  return {
    type: SET_STORE_SAVED,
  };
};

export const saveMenu = ({
   elementId, menuData, logoData,
}: { 
  elementId: string, menuData: MenuData, logoData?: LogoData
}): Action => {
  return {
    type: SAVE_MENU,
    payload: { elementId, menuData, logoData }
  }
}

export const toggleToolbar = (): Action => {
  return {
    type: TOGGLE_TOOLBAR
  }
}

// decoupled handleAddBlock
export const createBlockChild = (parentId: string, index?: number): void => {
  let newChildId: string = <string>uuid();
  dispatchToStore(
    addChildBlock({
      parentId,
      index,
      newChildId,
      newElementId: <string>uuid(),
    })
  );
  dispatchToStore(focusBlock({id: newChildId}));
}


export const createBlockChildren = (num: number, parentId: string): void => {
  for (let i = 0; i < num; i++) {
    createBlockChild(parentId);
  }
}

export const handleAddBlock = (parentId: string, store: State): void => {
  let numOfChildren: number = store.blockIds[parentId].length === 0 ? 2 : 1
 createBlockChildren(
  numOfChildren,
  parentId,
 );
}

export const handleDeleteBlock = ( id: string ): void => {
  dispatchToStore(deleteBlock({ id }));
}

export const setDataSources = ( dataSources: DataSources ): Action => {
  return {
    type: SET_DATA_SOURCES,
    payload: {
      dataSources
    }
  }
}

export const togglePublishPage = (): Action => {
  return {
    type: TOGGLE_PUBLISH_PAGE,
  }
}