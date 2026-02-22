import { EosPlotData } from "@sssp/models";

export default interface EosPlotProps {
  configuration: string;
  eosPseudosMap: Record<string, EosPlotData>;
  activePseudos: string[];
}
