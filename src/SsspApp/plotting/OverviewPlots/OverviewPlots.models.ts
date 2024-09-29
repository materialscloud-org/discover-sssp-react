import { ElementDataResponse } from "@sssp/services/models";

export interface OverviewPlotsProps {
  element: string;
  elementData: ElementDataResponse;
  activeAccuracy: string;
}
