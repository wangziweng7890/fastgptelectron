declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
export interface IElectronAPI {
  loadPreferences: () => Promise<void>,
  nodeVersion: () => string,
  chromeVersion: () => string,
  electronVersion: () => string,
  ping: () => Promise<void>,
  setTitle: (string) => void,
  openFile: () => Promise<string>,
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}