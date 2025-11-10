export interface PseudoMetadata {
  color: string;
  display_name: string;
  short_name: string;
}

export interface PseudosMetadata {
  [key: string]: PseudoMetadata;
}
