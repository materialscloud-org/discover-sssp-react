export interface ElementInfo {
  library: string;
  Z: number;
  cutoff_wfc: number;
  cutoff_rho: number;
  filename: string;
}

export type LibraryElementsInfo = Record<string, ElementInfo>;

export type ElementsInfo = Record<string, LibraryElementsInfo>;

export interface ElementModel {
  number: number;
  symbol: string;
  color: string;
  info: ElementInfo;
}
