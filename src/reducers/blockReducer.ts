import {
  ADD_CHILD_BLOCK,
  ADD_ELEMENT,
  CHANGE_ELEMENT_TYPE,
  SAVE_ELEMENT_CONTENT,
  SAVE_QUILL_INNERHTML,
  DELETE_BLOCK,
  SAVE_MENU,
  UPDATE_IMAGE_SRC,
  SET_BACKGROUND_IMAGE,
  SET_BACKGROUND_COLOR,
} from '../actions/constants';
import { v4 as uuid } from 'uuid';
import type {
  BlockIds,
  BlockProps,
  ElementProps,
  State,
  Action,
  BlockState,
  MenuData, 
  LogoData
} from '../types';


const blockReducer = (action: Action, state: BlockState): BlockState => {
  switch (action.type) {
    case ADD_CHILD_BLOCK: {
      let { 
        blockIds, 
        blockProps, 
        elementProps 
      }: {
        blockIds: BlockIds, 
        blockProps: BlockProps, 
        elementProps: ElementProps
      } = state;
      let { 
        parentId, 
        index, 
        newChildId, 
        newElementId 
      }:{
        parentId:string, 
        index?: number, 
        newChildId: string, 
        newElementId: string
      } = action.payload;
      let firstChild: boolean = blockIds[parentId].length === 0;

      if (index === undefined) index = blockIds[parentId].length

      return {
        ...state,
        blockIds: {
          ...blockIds,
          [newChildId]: [],
          [parentId]: [
            ...blockIds[parentId].slice(0, index),
            newChildId,
            ...blockIds[parentId].slice(index),
          ],
        },
        blockProps: {
          ...blockProps,
          [newChildId]: {
            vertical: blockProps[parentId].vertical ? false : true,
            elements: firstChild ? blockProps[parentId].elements : [newElementId],
            parent: parentId
          },
        },
        elementProps: firstChild ? elementProps : {
          ...elementProps,
          [newElementId]: { type: '', content: '', html: '' }
        },
      }
    }


    case ADD_ELEMENT: {
      let { 
        elementProps, blockProps 
      }:{
        elementProps: ElementProps, blockProps: BlockProps
      } = state;
      let { 
        type, blockId, index 
      }:{
        type: string, blockId: string, index?: number
      } = action.payload;
      if (index === undefined) index = blockProps[blockId].elements.length;
      const newElementId:string = <string>uuid();

      return {
        ...state,
        elementProps: {
          ...elementProps,
          [newElementId]: { type, content: '', html: '' },
        },
        blockProps: {
          ...blockProps,
          [blockId]: {
            ...blockProps[blockId],
            elements: [
              ...blockProps[blockId].elements.slice(0, index),
              newElementId,
              ...blockProps[blockId].elements.slice(index)
            ]
          }
        },
      }
    }

    case CHANGE_ELEMENT_TYPE: {
      let { elementProps }: {elementProps: ElementProps} = state;
      let { type, id }: { type: string, id: string} = action.payload;
      return {
        ...state,
        elementProps: {
          ...elementProps,
          [id]: { ...elementProps[id], type }
        }
      }
    }

    case SAVE_ELEMENT_CONTENT: {
      let { content, id }:{ content: string, id: string } = action.payload;
      return {
        ...state,
        elementProps: {
          ...state.elementProps,
          [id]: { ...state.elementProps[id], content }
        }
      }
    }

    case SAVE_QUILL_INNERHTML: {
      let { elementId, html }:{ elementId: string, html: string } = action.payload;
      return {
        ...state,
        elementProps: {
          ...state.elementProps,
          [elementId]: { ...state.elementProps[elementId], html }
        }
      }
    }

    case DELETE_BLOCK: {
      let { id }: { id: string} = action.payload;
      let parentId: string = Object.keys(state.blockIds).filter((bId): boolean => state.blockIds[bId].includes(id))[0];
      let numOfSiblings: number = state.blockIds[parentId].length;
      let siblingId: string = state.blockIds[parentId].filter(bId => bId !== id)[0];
      let elementIds: string[] = state.blockProps[id].elements;

      let restElementProps: ElementProps = {};
      Object.keys(state.elementProps).forEach((eId): void => {
        if (!elementIds.includes(eId)) {
          restElementProps[eId] = state.elementProps[eId]
        }
      })

      // Pass sibling element to the parent and delete sibling if only one sibling left
      if (numOfSiblings === 2 && parentId !== 'root') {
        let siblingElements: string[] = state.blockProps[siblingId].elements;
        let { [id]: _1, [siblingId]: _2, ...restBlockProps }:BlockProps = state.blockProps;

        return {
          ...state,
          blockProps: {
            ...restBlockProps,
            [parentId]: {
              ...restBlockProps[parentId],
              elements: siblingElements
            }
          },
          blockIds: {
            ...state.blockIds,
            [parentId]: []
          },
          elementProps: restElementProps
        };
      };

      let { [id]: deletedProps, ...restBlockProps }: BlockProps = state.blockProps;
      let { [id]: deletedIds, ...restBlockIds }: BlockIds = state.blockIds;
      let newBlockIds: BlockIds = {}
      Object.keys(restBlockIds).forEach((key): void => {
        newBlockIds[key] = restBlockIds[key].filter((bId): boolean => bId !== id);
      })

      return {
        ...state,
        blockProps: restBlockProps,
        blockIds: newBlockIds,
        elementProps: restElementProps,
      }
    }

    case UPDATE_IMAGE_SRC: {
      const { src, elementId }: {src: string, elementId: string} = action.payload;
      return {
        ...state,
        elementProps: {
          ...state.elementProps,
          [elementId]: {
            ...state.elementProps[elementId],
            src
          }
        }
      }
    }

    case SAVE_MENU: {
      const { 
        elementId, menuData, logoData 
      }: {
        elementId: string, menuData: MenuData, logoData: LogoData
      } = action.payload;
      return {
        ...state,
        elementProps: {
          ...state.elementProps,
          [elementId]: { 
            ...state.elementProps[elementId],
            menuData,
            logoData
          }
        }
      }
    }

    case SET_BACKGROUND_IMAGE: {
      const blockId: string = action.payload.blockId;
      const url: string = action.payload.url;
      const reload: boolean = action.payload.reload;
      return {
        ...state,
        blockProps: {
          ...state.blockProps,
          [blockId]: {
            ...state.blockProps[blockId],
            backgroundImage: { url, reload }
          }
        }
      }
    }

    case SET_BACKGROUND_COLOR: {
      let blockId: string = action.payload.blockId;
      return {
        ...state,
        blockProps: {
          ...state.blockProps,
          [blockId]: {
            ...state.blockProps[blockId],
            backgroundColor: action.payload.color
          }
        }
      }
    }


    default:
      return state;
  }
}


export default blockReducer
