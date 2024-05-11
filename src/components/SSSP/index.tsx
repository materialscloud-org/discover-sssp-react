import pseudo_metadata from "../../data/metadata.json";
import sssp_efficiency from "../../data/sssp_efficiency.json";

import { PTable } from "../PTable";

export const SSSP = () => {
  return (
    <div>
      <div>Placeholder for information, legend, etc</div>
      <PTable
        ssspData={sssp_efficiency}
        pseudoMetadata={pseudo_metadata}
        linkBase="https://www.materialscloud.org/discover/sssp/plot/efficiency"
      />
    </div>
  );
};
