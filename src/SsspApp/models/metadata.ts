export interface PseudoMetadata {
  color: string;
  display_name: string;
  short_name: string;
}

export interface PseudosMetadata {
  [pseudo: string]: PseudoMetadata;
}

export interface CategorizedPseudosMetadata {
  [category: string]: PseudosMetadata;
}
