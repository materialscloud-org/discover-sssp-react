export interface ElementInfo {
  pseudopotential: string;
  cutoff_wfc: number;
  cutoff_rho: number;
  Z: number;
}

export type LibraryElementsInfo = Record<string, ElementInfo>;

export type ElementsInfo = Record<string, LibraryElementsInfo>;

export interface ElementModel {
  number: number;
  symbol: string;
  color: string;
  info: ElementInfo;
}
