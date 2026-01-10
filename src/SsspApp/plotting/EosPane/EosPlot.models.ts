import { EosPseudosMap } from "@sssp/models";

export default interface EosPlotProps {
  configuration: string;
  eosPseudosMap: EosPseudosMap;
  activePseudos: string[];
}
