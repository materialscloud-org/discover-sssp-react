import { pseudoMetadata } from "@sssp/data";

export default class SsspDataService {
  private accuracy: string;
  private API = "https://www.materialscloud.org/mcloud/api/v2/discover/sssp";

  constructor(accuracy: string) {
    this.accuracy = accuracy;
  }

  // TODO consider caching
  fetchElementData = async (element: string) => {
    const response = await fetch(`${this.API}/elements/${element}`);
    return await response.json();
  };

  // TODO consider caching
  fetchElementsInfo = async () => {
    const response = await fetch(`${this.API}/${this.accuracy}_cutoffs`);
    const json = await response.json();
    return this.mapElementData(json?.data || {});
  };

  fetchPseudosMetadata(): PseudosMetadata {
    return pseudoMetadata;
  }

  private mapElementData = (json: ApiPseudosResponseType) => {
    const mappedElementData: ElementsInfo = {};
    Object.keys(json).forEach((element) => {
      const { elementClass, filename, md5, rho_cutoff, sub1, sub2 } =
        json[element];
      mappedElementData[element] = {
        cutoff: sub1,
        dual: sub2,
        filename,
        md5,
        pseudopotential: elementClass,
        rho_cutoff,
      };
    });
    return mappedElementData;
  };
}
