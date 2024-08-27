import { ElementInfo } from "../PeriodicTable.models";

export interface ElementModel {
  number: number;
  symbol: string;
  color: string;
  info: ElementInfo;
}

export interface ElementProps extends ElementModel {
  isTransparent: boolean;
  onHover: (element: ElementModel | null) => void;
}
