interface ConvergencePlotProps {
  element: string;
}

interface PseudoResponse {
  conff: string;
  pseudos: Pseudo[];
}

interface PseudoQuantity {
  cutoffs: number[];
  values: number[];
}

interface Pseudo {
  conff: string;
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
    phonon_frequencies?: PseudoQuantity & { error: number[]; ref: number };
    pressure?: PseudoQuantity;
    cohesive_energy?: PseudoQuantity & { ref: number };
    eos?: PseudoQuantity;
    bands?: {
      cutoffs: number[];
      eta_c: number[];
      max_diff_c: number[];
    };
  };
}
