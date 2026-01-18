import { PseudoConvergenceData, PseudosMetadata } from "@sssp/models";

export interface ConvergencePlotProps {
  element: string;
  summaryData: PseudoConvergenceData;
  pseudosMetadata: PseudosMetadata;
}
