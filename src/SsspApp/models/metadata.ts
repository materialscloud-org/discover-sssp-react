export interface PseudoMetadata {
  background_color: string;
  display_name: string;
  short_name: string;
}

export interface PseudosMetadata {
  [key: string]: PseudoMetadata;
}
