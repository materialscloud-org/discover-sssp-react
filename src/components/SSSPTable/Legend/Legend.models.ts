import { ElementModel } from "../PeriodicTable/Element/Element.models";
import { Metadata } from "../PeriodicTable/PeriodicTable.models";

export interface PseudosLegendProps {
  pseudoMetadata: { [key: string]: Metadata };
  hoveredPseudo: string;
  hoveredElement?: ElementModel;
  onHover: (pseudo: string) => void;
}
