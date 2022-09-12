import React from "react";

import PTable from "./PTable";

import pseudo_metadata from "../data/metadata.json";
import sssp_efficiency from "../data/sssp_efficiency.json";

class SSSP extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div>Placeholder for information, legend, etc</div>
        <PTable
          sssp_data={sssp_efficiency}
          pseudo_metadata={pseudo_metadata}
          link_base="https://www.materialscloud.org/discover/sssp/plot/efficiency"
        />
      </div>
    );
  }
}

export default SSSP;
