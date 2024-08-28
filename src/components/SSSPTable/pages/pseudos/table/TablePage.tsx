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

import { ElementModel } from "components/SSSPTable/PeriodicTable/Element/Element.models";
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
  const [hoveredElement, setHoveredElement] = useState<ElementModel>();

  const ssspData =
    activeAccuracy === "efficiency" ? ssspEfficiency : ssspPrecision;

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
        onChange={(value) => navigate(`../${value}`)}
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
        hoveredElement={hoveredElement}
        onHover={setHoveredPseudo}
      />
      <PeriodicTable
        pseudoMetadata={pseudoMetadata}
        ssspData={ssspData}
        hoveredPseudo={hoveredPseudo}
        hoveredElement={hoveredElement}
        onElementHover={setHoveredElement}
      />
    </>
  );
};

export default TablePage;
