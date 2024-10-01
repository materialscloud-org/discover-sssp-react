import {
  BandsData,
  ElementsInfo,
  EquationOfStateData,
  PseudosMetadata,
} from "@sssp/models";

import bandsDataJson from "./bands.json";
import eosDataJson from "./eos.json";
import pseudoMetadataJson from "./metadata.json";
import ssspEfficiencyJson from "./sssp_efficiency.json";
import ssspPrecisionJson from "./sssp_precision.json";

export const bandsData = bandsDataJson as BandsData;
export const eosData = eosDataJson as EquationOfStateData;
export const pseudoMetadata = pseudoMetadataJson as PseudosMetadata;
export const ssspEfficiency = ssspEfficiencyJson as ElementsInfo;
export const ssspPrecision = ssspPrecisionJson as ElementsInfo;
