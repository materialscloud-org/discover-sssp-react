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

export interface PseudoMetadata {
  background_color: string;
  display_name: string;
  short_name: string;
}

export interface PseudosMetadata {
  [key: string]: PseudoMetadata;
}

export interface EquationOfStatePlotsData {
  [pseudo: string]: {
    [configuration: string]: {
      volumes?: number[];
      energies?: number[];
      V0: number;
      B0: number;
      B1: number;
      nu?: number;
      E0?: number;
    };
  };
}

export interface EquationOfStateData {
  [element: string]: EquationOfStatePlotsData;
}
