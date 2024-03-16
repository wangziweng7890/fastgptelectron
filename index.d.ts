
export interface IElectronAPI {
  loadPreferences: () => Promise<void>,
  nodeVersion: () => string,
  chromeVersion: () => string,
  electronVersion: () => string,
  ping: () => Promise<void>,
  setTitle: (string) => void,
  openFile: () => Promise<string>,
  openURL: (string) => void,
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}