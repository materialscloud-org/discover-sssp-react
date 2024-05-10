interface ElementInfo {
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

interface Metadata {
  background_color: string;
  display_name: string;
  short_name: string;
}

export interface PTableProps {
  ssspData: { [key: string]: ElementInfo };
  pseudoMetadata: { [key: string]: Metadata };
  linkBase: string;
}
