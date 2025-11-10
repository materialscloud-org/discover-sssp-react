export interface PseudosColormap {
  [pseudo: string]: string;
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
  fermi_level: number;
}

export interface BandsPseudosMap {
  [pseudo: string]: BandsData;
}

export interface ElementBandsDataMap {
  [element: string]: BandsPseudosMap;
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
  cohesive_energy: {
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
