import { writable } from 'svelte/store';
import { rootReducer, initState, } from '../reducers';
import type { State, Action } from '../types';

const actionListener = writable(<Action>{});
const store = writable(initState);


actionListener.subscribe((action: Action): void => {
  store.update((state: State): State => {
    return rootReducer(action, state);
  });
});

// try {
//   if (window) {
//     store.subscribe(value => console.log('store', value));
//   }
// } catch (err) {

// }

// store.subscribe(value => console.log('store', value));

const dispatchToStore = (action: Action): void => actionListener.set(action)

export {
  dispatchToStore,
  store,
}