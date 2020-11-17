import type { State } from '../types';

const blockInitState:State = {
  "blockProps": {
    "root": {
      "vertical": true,
      "hideBtns": true,
      "parent": undefined
    },
    "first-block": {
      "elements": [
        "first-element"
      ],
      "vertical": false,
      "parent": "root"
    },
  },
  "elementProps": {
    "first-element": {
      "type": "menu",
    },
  },
  "blockIds": {
    "root": [
      "first-block",
    ],
    "first-block": [],
  },
  "pageProps": {
    "editingText": true,
    "editingLayout": true,
    "showToolbar": false,
    "focusedBlock": {},
  },
  saved: false,
  published: false
}

export default blockInitState;