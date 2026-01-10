import { API_URL, DATA_URL } from "@sssp/common/config";
import {
  BandChessboardsData,
  BandsData,
  BandsPseudosMap,
  ElementsInfo,
  EosData,
  PseudoBandsCalcUUIDs,
  PseudoConvergenceData,
  PseudosMetadata,
} from "@sssp/models";

export default class SsspDataService {
  static fetchElementsInfo = async (): Promise<ElementsInfo> => {
    const url = `${DATA_URL}/info/element.json`;
    const response = await fetch(url);
    const elementsInfo: ElementsInfo = await response.json();
    return elementsInfo || ({} as ElementsInfo);
  };

  static fetchEosData = async (): Promise<EosData> => {
    const url = `${DATA_URL}/eos.json`;
    const response = await fetch(url);
    const eosData: EosData = await response.json();
    return eosData || ({} as EosData);
  };

  static fetchBandsData = async (element: string): Promise<BandsPseudosMap> => {
    const fetchBandsDataFromApi = async (): Promise<BandsPseudosMap> => {
      let url = `${DATA_URL}/info/bands.json`;
      let response = await fetch(url);
      const content = await response.json();
      const data: Record<string, PseudoBandsCalcUUIDs> = content[element];
      const urlPromises = Object.entries(data).map(async ([pseudo, uuids]) => {
        url = `${API_URL}/nodes/${uuids.bands}/download?format=json`;
        response = await fetch(url);
        const bandsData: BandsData = await response.json();
        url = `${API_URL}/nodes/${uuids.params}/attributes`;
        response = await fetch(url);
        const json = await response.json();
        bandsData.fermiLevel = json["data"]["attributes"]["fermi_energy"];
        return [pseudo, bandsData] as [string, BandsData];
      });
      const entries = await Promise.all(urlPromises);
      const bandsPseudoMap: BandsPseudosMap = Object.fromEntries(entries);
      return bandsPseudoMap || ({} as BandsPseudosMap);
    };

    const fetchBandsDataFromDataUrl = async (): Promise<BandsPseudosMap> => {
      const url = `${DATA_URL}/bands/${element}.json`;
      const response = await fetch(url);
      const bandsPseudoMap: BandsPseudosMap = await response.json();
      return bandsPseudoMap || ({} as BandsPseudosMap);
    };

    return API_URL ? fetchBandsDataFromApi() : fetchBandsDataFromDataUrl();
  };

  static fetchBandChessboardData = async (
    element: string
  ): Promise<BandChessboardsData> => {
    const url = `${DATA_URL}/chessboards/${element}.json`;
    const response = await fetch(url);
    const bandChessboardsData: BandChessboardsData = await response.json();
    return bandChessboardsData || {};
  };

  static fetchPseudosMetadata = async (): Promise<PseudosMetadata> => {
    const url = `${DATA_URL}/info/pseudo.json`;
    const response = await fetch(url);
    const pseudosMetadata: PseudosMetadata = await response.json();
    return pseudosMetadata || ({} as PseudosMetadata);
  };

  static fetchPseudosSummaryData = async (
    element: string
  ): Promise<PseudoConvergenceData> => {
    const url = `${DATA_URL}/summary/${element}.json`;
    const response = await fetch(url);
    const pseudoConvergenceData: PseudoConvergenceData = await response.json();
    return pseudoConvergenceData || ({} as PseudoConvergenceData);
  };
}
