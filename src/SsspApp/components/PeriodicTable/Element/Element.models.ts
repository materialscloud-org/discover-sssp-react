import { ElementInfo } from "SsspApp/models";

export interface ElementModel {
  number: number;
  symbol: string;
  color: string;
  info: ElementInfo;
}

type ElementProps = ElementModel;

export default ElementProps;
