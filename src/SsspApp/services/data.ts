import {
  eosData,
  pseudoMetadata,
  ssspEfficiency,
  ssspPrecision,
} from "@sssp/data";
import {
  ElementsInfo,
  EquationOfStatePlotsData,
  PseudosMetadata,
} from "@sssp/models";

import { ElementDataResponse } from "./models";

export default class SsspDataService {
  private accuracy: string;
  private API = "https://www.materialscloud.org/mcloud/api/v2/discover/sssp";

  private elementsInfoMap: { [key: string]: ElementsInfo } = {
    efficiency: ssspEfficiency,
    precision: ssspPrecision,
  };

  constructor(accuracy: string) {
    this.accuracy = accuracy;
  }

  // TODO consider caching
  fetchElementData = async (element: string) => {
    const response = await fetch(`${this.API}/elements/${element}`);
    const json: ElementDataResponse = await response.json();
    return json || ({} as ElementDataResponse);
  };

  fetchElementsInfo = (): ElementsInfo => {
    try {
      return this.elementsInfoMap[this.accuracy];
    } catch (error) {
      console.error(`Invalid accuracy: ${this.accuracy}`);
      return {} as ElementsInfo;
    }
  };

  fetchEosData = (element: string): EquationOfStatePlotsData =>
    eosData[element];

  fetchPseudosMetadata = (): PseudosMetadata => pseudoMetadata;
}
