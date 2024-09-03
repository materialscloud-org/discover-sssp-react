import { ElementInfo } from "@sssp/models";

export interface ElementModel {
  number: number;
  symbol: string;
  color: string;
  info: ElementInfo;
}

type ElementProps = ElementModel;

export default ElementProps;
