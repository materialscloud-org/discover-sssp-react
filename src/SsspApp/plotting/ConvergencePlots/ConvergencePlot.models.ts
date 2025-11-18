import { PseudosMetadata } from "@sssp/models";

export interface ConvergencePlotProps {
  element: string;
  pseudosMetadata: PseudosMetadata;
}

export interface PseudoConvergenceData {
  conff: string;
  pseudos: Pseudo[];
}

interface PseudoQuantity {
  cutoffs: number[];
  values: number[];
}

export interface Pseudo {
  name: string;
  color: string;
  Z: number;
  quantities: {
    metadata?: {
      avg_nu: number;
      max_nu: number;
      ang_nu: number;
      max_conf: string;
    };
    phononFrequencies?: PseudoQuantity & { error: number[]; ref: number };
    pressure?: PseudoQuantity;
    cohesiveEnergy?: PseudoQuantity & { ref: number };
    eos?: PseudoQuantity;
    bands?: {
      cutoffs: number[];
      eta_c: number[];
      max_diff_c: number[];
    };
  };
}
