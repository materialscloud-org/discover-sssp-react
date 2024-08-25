import { ElementInfo } from "./Element/Element.models";

interface Metadata {
  background_color: string;
  display_name: string;
  short_name: string;
}

export interface PTableProps {
  ssspData: { [key: string]: ElementInfo };
  pseudoMetadata: { [key: string]: Metadata };
}
