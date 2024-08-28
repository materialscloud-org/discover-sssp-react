import { useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

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
  selectedAccuracy,
}) => {
  // TODO use a service to fetch the data
  const defaultAccuracy = accuracies[0];
  const current = location.pathname.split("/").pop();
  const [hoveredPseudo, setHoveredPseudo] = useState("");
  const [active, setActive] = useState(current || defaultAccuracy);
  const navigate = useNavigate();

  const ssspData =
    selectedAccuracy === "efficiency" ? ssspEfficiency : ssspPrecision;

  const handleNavigation = (value: string) => {
    setActive(value);
    navigate(`../${value}`);
  };

  return (
    <>
      <ToggleButtonGroup
        className={styles["accuracy-controls"]}
        type="radio"
        name="accuracy"
        value={active}
        onChange={handleNavigation}
      >
        {accuracies.map((accuracy) => (
          <ToggleButton key={accuracy} id={accuracy} value={accuracy}>
            {capitalize(accuracy)}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <div className={styles["sssp-header"]}>
        SSSP {selectedAccuracy} (v{ssspVersion})
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
