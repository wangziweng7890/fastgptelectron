
interface ProgressInfo {
  total: number;
  delta: number;
  transferred: number;
  percent: number;
  bytesPerSecond: number;
}
export interface IElectronAPI {
  loadPreferences: () => Promise<void>,
  nodeVersion: () => string,
  chromeVersion: () => string,
  electronVersion: () => string,
  ping: () => Promise<void>,
  setTitle: (string) => void,
  openFile: () => Promise<string>,
  openURL: (string) => void,
  minimize: () => void
  close: () => void
  affixWindow: (boolean) => Promise<boolean>
  exit: () => void
  checkUpdate: () => void
  onUpdateAvailable: (callback: () => void) => void,
  onDownloadProgress: (callback: (progress: ProgressInfo) => void) => void,
  onUpdateDownloaded: (callback: () => void) => void,
  onAppVersion: (callback: (version:string) => void) => void,
  refresh: () => void
  logout:  (callback: () => void) => void,
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}