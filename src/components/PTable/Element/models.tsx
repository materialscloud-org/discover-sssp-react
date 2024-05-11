export interface ElementInfo {
  cutoff: number;
  dual: number;
  filename: string;
  md5: string;
  pseudopotential: string;
  rho_cutoff: number;
}

export interface ElementProps {
  num: number;
  symbol: string;
  color: string;
  elemInfo: ElementInfo;
  linkBase: string;
}
