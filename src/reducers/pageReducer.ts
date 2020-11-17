import {
  LOAD_STORE,
  TOGGLE_EDIT_LAYOUT,
  TOGGLE_EDIT_TEXT,
  FOCUS_BLOCK,
  UPDATE_IMAGE_SRC,
  SET_STORE_SAVED,
  ADD_CHILD_BLOCK,
  CHANGE_ELEMENT_TYPE,
  SAVE_ELEMENT_CONTENT,
  SAVE_QUILL_INNERHTML,
  DELETE_BLOCK,
  ADD_ELEMENT,
  SAVE_MENU,
  TOGGLE_TOOLBAR,
  SET_BACKGROUND_IMAGE,
  SET_BACKGROUND_COLOR,
  SET_DATA_SOURCES,
  TOGGLE_PUBLISH_PAGE
} from '../actions/constants';
import type { Action, State, PageState } from '../types';

const pageReducer = (action: Action, state: PageState): PageState => {
  switch (action.type) {
    case LOAD_STORE: {
      let { data }: {data: State} = action.payload
      return {
        ...state,
        ...data,
      }
    }

    case TOGGLE_EDIT_LAYOUT: {
      return {
        ...state,
        pageProps: {
          ...state.pageProps,
          editingLayout: !state.pageProps.editingLayout
        }
      }
    }

    case TOGGLE_EDIT_TEXT: {
      return {
        ...state,
        pageProps: {
          ...state.pageProps,
          editingText: !state.pageProps.editingText,
        }
      }
    }

    case FOCUS_BLOCK: {
      const { id }: { id: string } = action.payload;
      return {
        ...state,
        pageProps: {
          ...state.pageProps,
          focusedBlock: { id },
        }
      }
    }

    case SET_STORE_SAVED: {
      return {
        ...state,
        saved: true
      }
    }

    case TOGGLE_TOOLBAR: {
      return {
        ...state,
        saved: false,
        pageProps: {
          ...state.pageProps,
          showToolbar: !state.pageProps.showToolbar
        }
      }
    }

    case DELETE_BLOCK:
      return {
        ...state,
        saved: false,
        pageProps: {
          ...state.pageProps,
          focusedBlock: {}
        }
      }

    case SET_DATA_SOURCES:
      return {
        ...state,
        saved: false,
        pageProps: {
          ...state.pageProps,
          dataSources: action.payload.dataSources
        }
      }
    
    case TOGGLE_PUBLISH_PAGE:
      return {
        ...state,
        saved: false,
        published: !state.published
      }

    case ADD_CHILD_BLOCK:
    case ADD_ELEMENT:
    case CHANGE_ELEMENT_TYPE:
    case SAVE_ELEMENT_CONTENT:
    case SAVE_QUILL_INNERHTML:
    case DELETE_BLOCK:
    case SAVE_MENU:
    case UPDATE_IMAGE_SRC:
    case SET_BACKGROUND_IMAGE:
    case SET_BACKGROUND_COLOR:
      return {
        ...state,
        saved: false
      }

    default:
      return state;
  }
}


export default pageReducer
