export interface ElementInfo {
  pseudopotential: string;
  cutoff_wfc: number;
  cutoff_rho: number;
  Z: number;
}

export interface ElementsInfo {
  [element: string]: ElementInfo;
}

export interface ElementModel {
  number: number;
  symbol: string;
  color: string;
  info: ElementInfo;
}
