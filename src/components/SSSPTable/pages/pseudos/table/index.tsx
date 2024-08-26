import { useState } from "react";

import PeriodicTable from "components/SSSPTable/PeriodicTable";
import PseudosLegend from "components/SSSPTable/PseudosLegend";

import pseudoMetadata from "data/metadata.json";
import ssspEfficiency from "data/sssp_efficiency.json";
import ssspPrecision from "data/sssp_precision.json";

const TablePage = ({ ssspType }: { ssspType: string }) => {
  // TODO use a service to fetch the data
  const [hoveredPseudo, setHoveredPseudo] = useState<string | null>(null);
  const ssspData = ssspType === "efficiency" ? ssspEfficiency : ssspPrecision;

  const onLegendHover = (pseudo: string | null) => {
    setHoveredPseudo(pseudo);
  };

  return (
    <>
      <PseudosLegend pseudoMetadata={pseudoMetadata} onHover={onLegendHover} />
      <PeriodicTable
        pseudoMetadata={pseudoMetadata}
        ssspData={ssspData}
        hoveredPseudo={hoveredPseudo}
      />
    </>
  );
};

export default TablePage;
