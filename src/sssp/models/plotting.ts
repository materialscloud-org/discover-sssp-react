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
      avgNu: number;
      maxNu: number;
      avgNuWoMax: number;
      maxConf: string;
    };
    phononFrequencies?: PseudoQuantity & { error: number[]; ref: number };
    pressure?: PseudoQuantity;
    cohesiveEnergy?: PseudoQuantity & { ref: number };
    eos?: PseudoQuantity;
    bands?: {
      cutoffs: number[];
      etaC: number[];
      maxDiffC: number[];
    };
  };
}

export interface EosPlotData {
  uuid: string;
  volumes?: number[];
  energies?: number[];
  V0: number;
  B0: number;
  B1: number;
  nu?: number;
  E0?: number;
}

export type EosConfigMap = Record<string, EosPlotData>;

export type EosPseudosMap = Record<
  string,
  {
    ecutrho: {
      efficiency: number;
      precision: number;
    };
    configurations: EosConfigMap;
    avgNu: {
      withMax: number;
      withoutMax: number;
    };
  }
>;

export type EosElementMap = Record<string, EosPseudosMap>;

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

export type BandsPseudosMap = Record<string, BandsData>;

interface BandChessboardDistanceData {
  eta: number[][];
  shift: number[][];
}

export interface BandChessboardsData {
  pseudos: string[];
  v_distance: BandChessboardDistanceData;
  v10_distance: BandChessboardDistanceData;
}

interface DataPoint {
  node_uuid: string;
  value: number | null;
}

interface DataSeries {
  X_series: string;
  points: DataPoint[];
  type: string;
  units: string;
}

interface XSeries {
  description: string;
  type: string;
  units: string;
  values: number[];
}

type YSeries = Record<string, Record<string, DataSeries>>;

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
  X_series: Record<string, XSeries>;
  Y_series: Record<string, YSeries>;
  default: DefaultSeries;
  framework: Framework[];
}
