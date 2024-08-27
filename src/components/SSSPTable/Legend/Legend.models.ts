import { Metadata } from "../PeriodicTable/PeriodicTable.models";

export interface PseudosLegendProps {
  pseudoMetadata: { [key: string]: Metadata };
  hoveredPseudo: string;
  onHover: (pseudo: string) => void;
}
