import { Metadata } from "../PeriodicTable/PeriodicTable.models";

export interface PseudosLegendProps {
  pseudoMetadata: { [key: string]: Metadata };
  onHover: (pseudo: string | null) => void;
}
