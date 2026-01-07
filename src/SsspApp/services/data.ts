import { DATA_URL } from "@sssp/common/config";
import {
  PseudosMetadata,
  BandsPseudosMap,
  ElementsInfo,
  EosData,
  PseudoConvergenceData,
  BandChessboardData,
} from "@sssp/models";

export default class SsspDataService {
  static fetchElementsInfo = async (): Promise<ElementsInfo> => {
    const url = `${DATA_URL}/info.json`;
    const response = await fetch(url);
    const json: ElementsInfo = await response.json();
    return json || ({} as ElementsInfo);
  };

  static fetchEosData = async (): Promise<EosData> => {
    const url = `${DATA_URL}/eos.json`;
    const response = await fetch(url);
    const json: EosData = await response.json();
    return json || ({} as EosData);
  };

  static fetchBandsData = async (element: string): Promise<BandsPseudosMap> => {
    const url = `${DATA_URL}/bands/${element}.json`;
    const response = await fetch(url);
    const json: BandsPseudosMap = await response.json();
    return json || ({} as BandsPseudosMap);
  };

  static fetchBandChessboardData = async (
    element: string
  ): Promise<BandChessboardData> => {
    const url = `${DATA_URL}/chessboards/${element}.json`;
    const response = await fetch(url);
    const json: BandChessboardData = await response.json();
    return json || {};
  };

  static fetchPseudosMetadata = async (): Promise<PseudosMetadata> => {
    const url = `${DATA_URL}/metadata.json`;
    const response = await fetch(url);
    const json: PseudosMetadata = await response.json();
    return json || ({} as PseudosMetadata);
  };

  static fetchPseudosSummaryData = async (
    element: string
  ): Promise<PseudoConvergenceData> => {
    const url = `${DATA_URL}/summary/${element}.json`;
    const response = await fetch(url);
    const json: PseudoConvergenceData = await response.json();
    return json || ({} as PseudoConvergenceData);
  };
}
