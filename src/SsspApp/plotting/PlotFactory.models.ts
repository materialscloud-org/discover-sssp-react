import { ElementDataResponse } from "@sssp/models";

export default interface PlotFactoryProps {
  element: string;
  elementData?: ElementDataResponse;
  activeAccuracy: string;
  type: string;
}
