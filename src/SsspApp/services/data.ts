import { API_URL, DATA_URL } from "@sssp/common/config";
import {
  BandChessboardsData,
  BandsCalcUUIDsMap,
  BandsPseudosMap,
  ElementsInfo,
  EosElementMap,
  PseudoBandsCalcUUIDsMap,
  PseudoConvergenceData,
  PseudoFilenames,
  PseudosMetadata,
} from "@sssp/models";

export default class SsspDataService {
  private static filenamesCache: PseudoFilenames | null = null;
  private static bandsCalcUUIDsCache: BandsCalcUUIDsMap | null = null;

  private static resolveUpfRepositoryPath = async (
    upfNodeUuid: string,
  ): Promise<{ path: string; filename: string }> => {
    if (!API_URL) {
      throw new Error("UPF retrieval requires VITE_API_URL to be set");
    }

    const metaUrl = `${API_URL}/nodes/${upfNodeUuid}/repo/metadata`;
    const metaResponse = await fetch(metaUrl);
    const metaJson = await metaResponse.json();
    const repoObjects = metaJson?.data?.attributes || {};

    const path = SsspDataService.findFirstRepositoryFilePath(repoObjects);
    if (!path) {
      throw new Error("No repository files found for this UPF node");
    }

    const filename = path.split("/").pop() || "pseudopotential.upf";
    return { path, filename };
  };

  private static findFirstRepositoryFilePath = (
    repoObjects: Record<string, any>,
    preferExtensions: string[] = [".upf", ".UPF"],
  ): string | null => {
    const entries = Object.entries(repoObjects || {}).filter(
      ([name]) => name !== "zipped",
    );

    const fileEntries: Array<[string, any]> = [];
    const dirEntries: Array<[string, any]> = [];

    for (const [name, meta] of entries) {
      if (meta?.type === "FILE") fileEntries.push([name, meta]);
      else if (meta?.type === "DIRECTORY") dirEntries.push([name, meta]);
    }

    const findInFiles = (exts: string[]): string | null => {
      for (const [name] of fileEntries) {
        if (exts.some((ext) => name.endsWith(ext))) return name;
      }
      return null;
    };

    const preferred = findInFiles(preferExtensions);
    if (preferred) return preferred;

    if (fileEntries.length) return fileEntries[0][0];

    for (const [dirName, meta] of dirEntries) {
      const nested = SsspDataService.findFirstRepositoryFilePath(
        meta?.objects || {},
        preferExtensions,
      );
      if (nested) return `${dirName}/${nested}`;
    }

    return null;
  };

  static fetchBandsCalcUUIDs = async (
    element: string,
  ): Promise<PseudoBandsCalcUUIDsMap> => {
    const content = await SsspDataService.fetchBandsCalcUUIDsAll();
    return (content?.[element] || {}) as PseudoBandsCalcUUIDsMap;
  };

  static fetchBandsCalcUUIDsAll = async (): Promise<BandsCalcUUIDsMap> => {
    if (SsspDataService.bandsCalcUUIDsCache) {
      return SsspDataService.bandsCalcUUIDsCache;
    }

    const url = `${DATA_URL}/info/bands.json`;
    const response = await fetch(url);
    const content = (await response.json()) as BandsCalcUUIDsMap;

    SsspDataService.bandsCalcUUIDsCache = content || {};
    return SsspDataService.bandsCalcUUIDsCache;
  };

  static fetchPseudoFilenames = async (): Promise<PseudoFilenames> => {
    if (SsspDataService.filenamesCache) return SsspDataService.filenamesCache;

    const url = `${DATA_URL}/info/filenames.json`;
    const response = await fetch(url);
    const content = (await response.json()) as PseudoFilenames;
    SsspDataService.filenamesCache = content || {};
    return SsspDataService.filenamesCache;
  };

  static fetchUpfFile = async (
    upfNodeUuid: string,
  ): Promise<{ filename: string; content: string }> => {
    const { filename, blob } = await SsspDataService.fetchUpfBlob(upfNodeUuid);
    const content = await blob.text();
    return { filename, content };
  };

  static fetchUpfBlob = async (
    upfNodeUuid: string,
  ): Promise<{ filename: string; blob: Blob }> => {
    if (!API_URL) {
      throw new Error("UPF retrieval requires VITE_API_URL to be set");
    }

    const { path, filename } =
      await SsspDataService.resolveUpfRepositoryPath(upfNodeUuid);

    const contentsUrl = `${API_URL}/nodes/${upfNodeUuid}/repo/contents?filename=${encodeURIComponent(
      path,
    )}`;
    const contentsResponse = await fetch(contentsUrl);
    const blob = await contentsResponse.blob();
    return { filename, blob };
  };

  static fetchElementsInfo = async (): Promise<ElementsInfo> => {
    const url = `${DATA_URL}/info/element.json`;
    const response = await fetch(url);
    const elementsInfo: ElementsInfo = await response.json();
    return elementsInfo || ({} as ElementsInfo);
  };

  static fetchEosData = async (): Promise<EosElementMap> => {
    const url = `${DATA_URL}/eos.json`;
    const response = await fetch(url);
    const eosData: EosElementMap = await response.json();
    return eosData || ({} as EosElementMap);
  };

  static fetchBandsData = async (element: string): Promise<BandsPseudosMap> => {
    const url = `${DATA_URL}/bands/${element}.json`;
    const response = await fetch(url);
    const bandsPseudoMap: BandsPseudosMap = await response.json();
    return bandsPseudoMap || ({} as BandsPseudosMap);
  };

  static fetchBandChessboardData = async (
    element: string,
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
    element: string,
  ): Promise<PseudoConvergenceData> => {
    const url = `${DATA_URL}/summary/${element}.json`;
    const response = await fetch(url);
    const pseudoConvergenceData: PseudoConvergenceData = await response.json();
    return pseudoConvergenceData || ({} as PseudoConvergenceData);
  };
}
