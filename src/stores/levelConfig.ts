import { writable } from 'svelte/store';

const levelConfig = writable({
  0: {
    headDivider: true,
    tailDivider: true
  },
  1: {
    height: 500,
  },
  default: {},
});

export default levelConfig;