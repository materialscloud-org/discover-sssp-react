import { BandsPseudosMap } from "@sssp/models";

export default interface BandStructurePlotProps {
  pseudosMetadata: Record<string, any>;
  bandsPseudosMap: BandsPseudosMap;
  activePseudos: string[];
  bandShift: number;
}
