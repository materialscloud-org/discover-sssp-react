import { EosPseudosMap, PseudosColormap } from "@sssp/models";

export default interface EosPlotProps {
  configuration: string;
  eosPseudosMap: EosPseudosMap;
  pseudosColormap: PseudosColormap;
  activePseudos: string[];
}
