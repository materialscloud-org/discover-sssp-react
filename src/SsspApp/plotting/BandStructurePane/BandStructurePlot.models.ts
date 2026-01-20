import { BandsPseudosMap, PseudosMetadata } from "@sssp/models";

export default interface BandStructurePlotProps {
  pseudosMetadata: PseudosMetadata;
  bandsPseudosMap: BandsPseudosMap;
  activePseudos: string[];
  bandShift: number;
}
