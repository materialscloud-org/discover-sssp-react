import { ElementInfo } from "../PeriodicTable.models";

export interface ElementProps {
  number: number;
  symbol: string;
  color: string;
  info: ElementInfo;
}
