import { DATA_URL } from "@sssp/common/config";
import {
  ElementBandsDataMap,
  ElementDataResponse,
  ElementsInfo,
  EquationOfStateData,
  PseudosMetadata,
} from "@sssp/models";

export default class SsspDataService {
  private API = "https://legacy-api.materialscloud.org/api/v2/discover/sssp";

  fetchElementData = async (element: string): Promise<ElementDataResponse> => {
    const url = `${this.API}/elements/${element}`;
    const response = await fetch(url);
    const json: ElementDataResponse = await response.json();
    return json || ({} as ElementDataResponse);
  };

  fetchElementsInfo = async (accuracy: string): Promise<ElementsInfo> => {
    const url = `${DATA_URL}/${accuracy}/info.json`;
    const response = await fetch(url);
    const json: ElementsInfo = await response.json();
    return json || ({} as ElementsInfo);
  };

  fetchEosData = async (accuracy: string): Promise<EquationOfStateData> => {
    const url = `${DATA_URL}/${accuracy}/eos.json`;
    const response = await fetch(url);
    const json: EquationOfStateData = await response.json();
    return json || ({} as EquationOfStateData);
  };

  fetchBandsData = async (accuracy: string): Promise<ElementBandsDataMap> => {
    const url = `${DATA_URL}/${accuracy}/bands.json`;
    const response = await fetch(url);
    const json: ElementBandsDataMap = await response.json();
    return json || ({} as ElementBandsDataMap);
  };

  fetchPseudosMetadata = async (): Promise<PseudosMetadata> => {
    const url = `${DATA_URL}/metadata.json`;
    const response = await fetch(url);
    const json: PseudosMetadata = await response.json();
    return json || ({} as PseudosMetadata);
  };

  fetchPseudosSummaryData = async (
    accuracy: string,
    element: string,
    convergence: string
  ): Promise<PseudoResponse> => {
    console.log(convergence); // TODO use convergence when available
    const url = `${DATA_URL}/${accuracy}/summary/${element}.json`;
    const response = await fetch(url);
    const json: PseudoResponse = await response.json();
    return json || ({} as PseudoResponse);
  };
}
