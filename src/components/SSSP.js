import React from "react";

import PTable from "./PTable";

import pseudo_metadata from "../data/metadata.json";
import sssp_efficiency from "../data/sssp_efficiency.json";

const SSSP = () => {
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

export default SSSP;
