import { useContext, useEffect } from "react";
import { ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

import { capitalize } from "common/utils";

import AccuracyContext from "context/AccuracyContext";
import HoverContext from "context/HoverContext";
import useHover from "context/useHover";

import { ssspVersion } from "components/SSSPTable";
import PseudosLegend from "components/SSSPTable/Legend";
import PeriodicTable from "components/SSSPTable/PeriodicTable";

import pseudoMetadata from "data/metadata.json";
import ssspEfficiency from "data/sssp_efficiency.json";
import ssspPrecision from "data/sssp_precision.json";

import { TablePageProps } from "./TablePage.models";

import styles from "./TablePage.module.scss";

const TablePage: React.FC<TablePageProps> = ({ accuracies }) => {
  // TODO use a service to fetch the data
  const navigate = useNavigate();
  const location = useLocation();
  const hoverContext = useHover();
  const { activeAccuracy, setActiveAccuracy } = useContext(AccuracyContext);

  const ssspData =
    activeAccuracy === "efficiency" ? ssspEfficiency : ssspPrecision;

  useEffect(() => {
    const currentAccuracy = location.pathname.split("/")[2];
    setActiveAccuracy(currentAccuracy);
  }, [location.pathname, setActiveAccuracy]);

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
      <HoverContext.Provider value={hoverContext}>
        <PseudosLegend pseudoMetadata={pseudoMetadata} />
        <PeriodicTable pseudoMetadata={pseudoMetadata} ssspData={ssspData} />
      </HoverContext.Provider>
    </>
  );
};

export default TablePage;
