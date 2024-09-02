import { ElementInfo } from "../PeriodicTable.models";

export interface ElementModel {
  number: number;
  symbol: string;
  color: string;
  info: ElementInfo;
}
