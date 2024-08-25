export interface ElementInfo {
  cutoff: number;
  dual: number;
  filename: string;
  md5: string;
  pseudopotential: string;
  rho_cutoff: number;
}

export interface Metadata {
  background_color: string;
  display_name: string;
  short_name: string;
}

export interface PeriodicTableProps {
  ssspData: { [key: string]: ElementInfo };
  pseudoMetadata: { [key: string]: Metadata };
}
