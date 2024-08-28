import { useEffect, useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

import { capitalize } from "common/utils";

import { ssspVersion } from "components/SSSPTable";
import PseudosLegend from "components/SSSPTable/Legend";
import PeriodicTable from "components/SSSPTable/PeriodicTable";

import pseudoMetadata from "data/metadata.json";
import ssspEfficiency from "data/sssp_efficiency.json";
import ssspPrecision from "data/sssp_precision.json";

import { TablePageProps } from "./TablePage.models";

import styles from "./TablePage.module.scss";

const TablePage: React.FC<TablePageProps> = ({
  accuracies,
  activeAccuracy,
  onAccuracyToggle,
}) => {
  // TODO use a service to fetch the data
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredPseudo, setHoveredPseudo] = useState("");

  const ssspData =
    activeAccuracy === "efficiency" ? ssspEfficiency : ssspPrecision;

  const handleNavigation = (value: string) => {
    navigate(`../${value}`);
  };

  useEffect(() => {
    const currentAccuracy = location.pathname.split("/")[2];
    onAccuracyToggle(currentAccuracy);
  }, [location.pathname, onAccuracyToggle]);

  return (
    <>
      <ToggleButtonGroup
        className={styles["accuracy-controls"]}
        type="radio"
        name="accuracy"
        value={activeAccuracy}
        onChange={handleNavigation}
      >
        {accuracies.map((accuracy) => (
          <ToggleButton key={accuracy} id={accuracy} value={accuracy}>
            {capitalize(accuracy)}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <div className={styles["sssp-header"]}>
        SSSP {activeAccuracy} (v{ssspVersion})
      </div>
      <PseudosLegend
        pseudoMetadata={pseudoMetadata}
        hoveredPseudo={hoveredPseudo}
        onHover={(pseudo) => setHoveredPseudo(pseudo)}
      />
      <PeriodicTable
        pseudoMetadata={pseudoMetadata}
        ssspData={ssspData}
        hoveredPseudo={hoveredPseudo}
      />
    </>
  );
};

export default TablePage;
