export interface PseudoMetadata {
  category: string;
  color: string;
  display_name: string;
  short_name: string;
}

export interface PseudosMetadata {
  [pseudo: string]: PseudoMetadata;
}
