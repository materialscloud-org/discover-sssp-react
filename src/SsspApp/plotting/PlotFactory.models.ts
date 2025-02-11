import { ElementDataResponse } from "@sssp/services/models";

export interface PlotFactoryProps {
  element: string;
  elementData?: ElementDataResponse;
  activeAccuracy: string;
  type: string;
}
