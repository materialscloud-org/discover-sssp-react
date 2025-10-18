export interface ElementInfo {
  cutoff: number;
  dual: number;
  filename: string;
  md5: string;
  pseudopotential: string;
  rho_cutoff: number;
}

export interface ElementsInfo {
  [key: string]: ElementInfo;
}

export interface ElementModel {
  number: number;
  symbol: string;
  color: string;
  info: ElementInfo;
}
