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

export interface ElementDataResponse {
  bands_filenames: string[];
  chessboards_filenames: string[];
  data: ElementData;
  efficiency_filenames: string[];
  eos_filenames: string[];
  method: string;
  path: string;
  precision_filenames: string[];
  url: string;
  url_root: string;
}
