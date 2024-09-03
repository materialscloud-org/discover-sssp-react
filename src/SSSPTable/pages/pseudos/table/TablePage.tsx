import { useContext, useEffect } from "react";
import { ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

import { ssspVersion } from "@sssp";
import { capitalize } from "@sssp/common/utils";
import PseudosLegend from "@sssp/components/Legend";
import PeriodicTable from "@sssp/components/PeriodicTable";
import { AccuracyContext, HoverProvider } from "@sssp/context";
import pseudoMetadata from "@sssp/data/metadata.json";
import ssspEfficiency from "@sssp/data/sssp_efficiency.json";
import ssspPrecision from "@sssp/data/sssp_precision.json";

import TablePageProps from "./TablePage.models";
import styles from "./TablePage.module.scss";

const TablePage: React.FC<TablePageProps> = ({ accuracies }) => {
  // TODO use a service to fetch the data
  const navigate = useNavigate();
  const location = useLocation();
  const { activeAccuracy, setActiveAccuracy } = useContext(AccuracyContext);

  const ssspData =
    activeAccuracy === "efficiency" ? ssspEfficiency : ssspPrecision;

  useEffect(() => {
    const currentAccuracy = location.pathname.split("/")[2];
    setActiveAccuracy(currentAccuracy);
  }, [location.pathname, setActiveAccuracy]);

  return (
    <div id="table-page">
      <ToggleButtonGroup
        id={styles["accuracy-controls"]}
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
      <div className="sssp-pseudos-header">
        SSSP {activeAccuracy} (v{ssspVersion})
      </div>
      <HoverProvider>
        <PseudosLegend pseudoMetadata={pseudoMetadata} />
        <PeriodicTable pseudoMetadata={pseudoMetadata} ssspData={ssspData} />
      </HoverProvider>
    </div>
  );
};

export default TablePage;
