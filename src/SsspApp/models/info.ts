export interface PseudoMetadata {
  category: string;
  color: string;
  display_name: string;
}

export type PseudosMetadata = Record<string, PseudoMetadata>;

export interface PseudoBandsCalcUUIDs {
  upf: string;
  params: string;
  bands: string;
}

export type PseudoBandsCalcUUIDsMap = Record<string, PseudoBandsCalcUUIDs>;

export type BandsCalcUUIDsMap = Record<string, PseudoBandsCalcUUIDsMap>;

export type PseudoFilenames = Record<string, Record<string, string>>;
