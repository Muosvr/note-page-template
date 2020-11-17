import type { State, SingleBlockProps, BackgroundImage, LogoData } from '../types';

export const selectShowToolbar = (store: State): boolean => store.pageProps.showToolbar;

export const selectFocusedBlockId = (store: State):string => store.pageProps.focusedBlock.id;

export const selectBlockProps = ({ store, blockId }: {store: State, blockId: string}): SingleBlockProps => store.blockProps[blockId];

export const selectFocusedBlockVertical = (store: State): boolean => {
  let blockId = selectFocusedBlockId(store);
  let blockProps = selectBlockProps({ store, blockId})
  return blockProps.vertical;
}

export const selectAllBlockIds = ( store: State ): string[] => Object.keys(store.blockIds);

export const selectParentLagecy = (
  { store, blockId }: {store: State, blockId: string}
): string => {
  let allBlockIds: string[] = selectAllBlockIds(store);
  return (
    allBlockIds.filter(potentialParentiId => {
    return store.blockIds[potentialParentiId].includes(blockId);
  })|| [ undefined ])[0];
}

export const selectBlockParent = (
  { store, blockId }: { store: State, blockId: string }
): string => store.blockProps[blockId].parent;

export const selectBackgroundImage = (
  store: State, blockId: string
): BackgroundImage => store.blockProps[blockId].backgroundImage;

export const selectBackgroundColor = (
  store: State, blockId: string
): string => store.blockProps[blockId].backgroundColor;

// export const selectTextLogo = ( 
//   store: State, elementId: string 
// ): string => store.elementProps[elementId].textLogo

export const selectLogoData = (
  store: State, elementId: string
): LogoData => store.elementProps[elementId].logoData