import {
  ElementsInfo,
  EquationOfStateData,
  ElementBandsDataMap,
  PseudosMetadata,
} from "@sssp/models";

import { IMAGE_DATA_BASE_URL } from "../../common/config";

import { ElementDataResponse } from "./models";

export default class SsspDataService {
  private API = "https://legacy-api.materialscloud.org/api/v2/discover/sssp";

  fetchElementData = async (element: string): Promise<ElementDataResponse> => {
    const response = await fetch(`${this.API}/elements/${element}`);
    const json: ElementDataResponse = await response.json();
    return json || ({} as ElementDataResponse);
  };

  fetchElementsInfo = async (accuracy: string): Promise<ElementsInfo> => {
    const response = await fetch(
      `${IMAGE_DATA_BASE_URL}/${accuracy}/info.json`
    );
    const json: ElementsInfo = await response.json();
    return json || ({} as ElementsInfo);
  };

  fetchEosData = async (accuracy: string): Promise<EquationOfStateData> => {
    const response = await fetch(`${IMAGE_DATA_BASE_URL}/${accuracy}/eos.json`);
    const json: EquationOfStateData = await response.json();
    return json || ({} as EquationOfStateData);
  };

  fetchBandsData = async (accuracy: string): Promise<ElementBandsDataMap> => {
    const response = await fetch(
      `${IMAGE_DATA_BASE_URL}/${accuracy}/bands.json`
    );
    const json: ElementBandsDataMap = await response.json();
    return json || ({} as ElementBandsDataMap);
  };

  fetchPseudosMetadata = async (): Promise<PseudosMetadata> => {
    const response = await fetch(`${IMAGE_DATA_BASE_URL}/metadata.json`);
    const json: PseudosMetadata = await response.json();
    return json || ({} as PseudosMetadata);
  };

  fetchPseudosSummaryData = async (
    accuracy: string,
    element: string,
    convergence: string
  ): Promise<PseudoResponse> => {
    const response = await fetch(
      `${IMAGE_DATA_BASE_URL}/${accuracy}/summary/${element}_${convergence}.json`
    );
    const json: PseudoResponse = await response.json();
    return json || ({} as PseudoResponse);
  };
}
