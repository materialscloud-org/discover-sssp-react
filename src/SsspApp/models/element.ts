export interface ElementInfo {
  pseudopotential: string;
  cutoff_wfc: number;
  cutoff_rho: number;
  Z: number;
}

export interface LibraryElementsInfo {
  [element: string]: ElementInfo;
}

export interface ElementsInfo {
  [library: string]: LibraryElementsInfo;
}

export interface ElementModel {
  number: number;
  symbol: string;
  color: string;
  info: ElementInfo;
}
