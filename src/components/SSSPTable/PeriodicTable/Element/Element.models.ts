import { ElementInfo } from "../PeriodicTable.models";

export interface ElementModel {
  number: number;
  symbol: string;
  color: string;
  info: ElementInfo;
}

export interface ElementProps extends ElementModel {
  onHover: (element: ElementModel | null) => void;
}
