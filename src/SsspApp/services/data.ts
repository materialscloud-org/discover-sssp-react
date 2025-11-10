import { DATA_URL } from "@sssp/common/config";
import {
  ElementBandsDataMap,
  ElementDataResponse,
  ElementsInfo,
  EosData,
  PseudosMetadata,
} from "@sssp/models";

const API = "https://legacy-api.materialscloud.org/api/v2/discover/sssp";

export default class SsspDataService {
  static fetchElementData = async (
    element: string
  ): Promise<ElementDataResponse> => {
    const url = `${API}/elements/${element}`;
    const response = await fetch(url);
    const json: ElementDataResponse = await response.json();
    return json || ({} as ElementDataResponse);
  };

  static fetchElementsInfo = async (library: string): Promise<ElementsInfo> => {
    const url = `${DATA_URL}/${library}/info.json`;
    const response = await fetch(url);
    const json: ElementsInfo = await response.json();
    return json || ({} as ElementsInfo);
  };

  static fetchEosData = async (library: string): Promise<EosData> => {
    const url = `${DATA_URL}/${library}/eos.json`;
    const response = await fetch(url);
    const json: EosData = await response.json();
    return json || ({} as EosData);
  };

  static fetchBandsData = async (
    library: string
  ): Promise<ElementBandsDataMap> => {
    const url = `${DATA_URL}/${library}/bands.json`;
    const response = await fetch(url);
    const json: ElementBandsDataMap = await response.json();
    return json || ({} as ElementBandsDataMap);
  };

  static fetchPseudosMetadata = async (): Promise<PseudosMetadata> => {
    const url = `${DATA_URL}/metadata.json`;
    const response = await fetch(url);
    const json: PseudosMetadata = await response.json();
    return json || ({} as PseudosMetadata);
  };

  static fetchPseudosSummaryData = async (
    library: string,
    element: string
  ): Promise<PseudoResponse> => {
    const url = `${DATA_URL}/${library}/summary/${element}.json`;
    const response = await fetch(url);
    const json: PseudoResponse = await response.json();
    return json || ({} as PseudoResponse);
  };
}
