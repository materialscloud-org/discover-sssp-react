export interface ElementInfo {
  cutoff: number;
  dual: number;
  filename: string;
  md5: string;
  pseudopotential: string;
  rho_cutoff: number;
}
export interface SsspData {
  [key: string]: ElementInfo;
}

export interface Metadata {
  background_color: string;
  display_name: string;
  short_name: string;
}

export interface PseudoMetadata {
  [key: string]: Metadata;
}
