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
      avg_nu_wo_xo3: number;
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

export interface EosPlotData {
  volumes?: number[];
  energies?: number[];
  V0: number;
  B0: number;
  B1: number;
  nu?: number;
  E0?: number;
}

export interface EosPseudosMap {
  [pseudo: string]: EosPlotData;
}

export interface EosConfigMap {
  [configuration: string]: EosPseudosMap;
}

export interface EosData {
  [element: string]: EosConfigMap;
}

export interface Path {
  length: number;
  from: string;
  to: string;
  values: number[][];
  x: number[];
  two_band_types: boolean;
}

export interface BandsData {
  label: string;
  path: string[][];
  paths: Path[];
  original_uuid: string;
  comments: string;
  fermiLevel: number;
}

export interface BandsPseudosMap {
  [pseudo: string]: BandsData;
}

export interface PseudoBandsCalcUUIDs {
  upf: string;
  params: string;
  bands: string;
}

interface BandChessboardDistanceData {
  eta_c: number[][];
  max_diff_c: number[][];
  shift_c: number[][];
}

export interface BandChessboardsData {
  pseudos: string[];
  v_distance: BandChessboardDistanceData;
  v10_distance: BandChessboardDistanceData;
}

interface DataSeries {
  X_series: string;
  points: {
    node_uuid: string;
    value: number | null;
  }[];
  type: string;
  units: string;
}

interface XSeries {
  description: string;
  type: string;
  units: string;
  values: number[];
}

interface YSeries {
  [key: string]: {
    [key: string]: DataSeries;
  };
}

interface DefaultSeries {
  cohesiveEnergy: {
    X_label: string;
    Y_label: string;
    data_series: [string, string, number][];
    description: string;
    title: string;
  };
}

interface AdditionalInfo {
  description?: string;
  display_name?: string;
  md5checksum?: string;
  node_uuid?: string;
}

interface Framework {
  additional_infos: AdditionalInfo[];
  available_values: string[] | number[];
  description: string;
  name: string;
  overlayable: boolean;
  type: string;
}

export interface ElementData {
  X_series: {
    [key: string]: XSeries;
  };
  Y_series: {
    [key: string]: YSeries;
  };
  default: DefaultSeries;
  framework: Framework[];
}
