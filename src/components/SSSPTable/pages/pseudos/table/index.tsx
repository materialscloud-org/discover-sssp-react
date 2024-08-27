import { useState } from "react";
import { useLocation } from "react-router-dom";

import { ssspVersion } from "components/SSSPTable";
import PseudosLegend from "components/SSSPTable/Legend";
import PeriodicTable from "components/SSSPTable/PeriodicTable";

import pseudoMetadata from "data/metadata.json";
import ssspEfficiency from "data/sssp_efficiency.json";
import ssspPrecision from "data/sssp_precision.json";

import styles from "./index.module.scss";

const TablePage = () => {
  // TODO use a service to fetch the data
  const [hoveredPseudo, setHoveredPseudo] = useState<string | null>(null);
  const ssspType = useLocation().pathname.split("/")[2];
  const ssspData = ssspType === "efficiency" ? ssspEfficiency : ssspPrecision;

  const onLegendHover = (pseudo: string | null) => {
    setHoveredPseudo(pseudo);
  };

  return (
    <>
      <div id={styles["sssp-header"]}>
        SSSP {ssspType} (v{ssspVersion})
      </div>
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
