export interface BlockIds {
  [index: string]: string[]
}

export interface SingleBlockProps {
    vertical: boolean,
    elements?: string[],
    parent: string,
    hideBtns?: boolean,
    height?: string,
    backgroundImage?: BackgroundImage
    backgroundColor?: string
}

export interface BlockProps {
  [index: string]: SingleBlockProps
}

export interface BackgroundImage {
  url?: string,
  size?: string,
  position?: string,
  reload?: boolean
}

export interface SingleElementProps {
  type: string,
  content?: string,
  html?: string,
  src?: string,
  menuData?: MenuData,
  logoData?: LogoData
}

export interface ElementProps {
  [index: string]: SingleElementProps
}


export interface Action {
  type: string,
  payload?: any
}

export interface FocusedBlock {
  id?: string,
};

export interface DataSource{
  url: string,
  ssr?: boolean
};

export type DataSources = DataSource[];

export interface PageProps {
  editingLayout: boolean,
  editingText?: boolean,
  focusedBlock: FocusedBlock,
  showToolbar: boolean
  dataSources?: DataSources
}

export interface State {
  blockProps: BlockProps,
  blockIds: BlockIds,
  elementProps: ElementProps,
  pageProps: PageProps,
  saved: boolean,
  published: boolean,
  pageId?: string
}

export interface BlockState {
  blockProps: BlockProps,
  elementProps: ElementProps,
  blockIds: BlockIds
}

export interface PageState {
  pageProps: PageProps,
  saved: boolean,
  published: boolean
}

export type MenuData = MenuItem[];

export interface MenuItem {
  text: string,
  href: string,
}

export interface LogoData {
  name: string,
  image?: string,
  href: string
}