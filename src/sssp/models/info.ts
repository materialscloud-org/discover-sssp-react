export interface Citation {
  citation?: string;
}

export interface MethodMetadata extends Citation {
  website?: string;
}

export interface PseudoLibraryMetadata extends MethodMetadata {
  license?: string;
  versions?: string[];
}

export interface PseudoMetadata {
  library: string;
  category: string;
  color: string;
  displayName: string;
  description?: string;
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

export type RepositoryFileObject = {
  type: "FILE" | "DIRECTORY";
  binary?: boolean;
  size?: number;
  download?: string;
  objects?: Record<string, RepositoryFileObject>;
};

export type RepositoryMetadata = Record<string, RepositoryFileObject>;
