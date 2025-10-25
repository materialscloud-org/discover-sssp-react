import { ElementDataResponse } from "@sssp/models";

export default interface OverviewPlotsProps {
  element: string;
  elementData: ElementDataResponse;
  activeLibrary: string;
}
