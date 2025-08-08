import { useContext, useEffect, useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

import { ssspVersion } from "@sssp";
import { capitalize } from "@sssp/common/utils";
import PseudosLegend from "@sssp/components/Legend";
import PeriodicTable from "@sssp/components/PeriodicTable";
import { AccuracyContext, HoverProvider } from "@sssp/context";
import { ElementsInfo, PseudosMetadata } from "@sssp/models";
import SsspDataService from "@sssp/services/data";

import TablePageProps from "./TablePage.models";
import styles from "./TablePage.module.scss";

const TablePage: React.FC<TablePageProps> = ({ accuracies }) => {
  const location = useLocation();
  const { activeAccuracy, setActiveAccuracy } = useContext(AccuracyContext);
  const [elementsInfo, setElementsInfo] = useState<ElementsInfo>({});
  const [pseudosMetadata, setPseudosMetadata] = useState<PseudosMetadata>({});

  useEffect(() => {
    const currentAccuracy = location.pathname.split("/")[2];
    setActiveAccuracy(currentAccuracy);
  }, [location.pathname, setActiveAccuracy]);

  useEffect(() => {
    const dataService = new SsspDataService();
    dataService
      .fetchPseudosMetadata()
      .then((metadata) => setPseudosMetadata(metadata))
      .catch((error) => {
        console.error("Error fetching pseudos metadata:", error);
      });
  }, []);

  useEffect(() => {
    const dataService = new SsspDataService();
    dataService
      .fetchElementsInfo(activeAccuracy)
      .then((elementsInfo) => setElementsInfo(elementsInfo))
      .catch((error) => {
        console.error("Error fetching elements info:", error);
      });
  }, [activeAccuracy]);

  return (
    <div id="table-page">
      <div className="sssp-pseudos-header">
        SSSP {activeAccuracy} (v{ssspVersion})
      </div>
      <HoverProvider>
        <PseudosLegend pseudosMetadata={pseudosMetadata} />
        <AccuracyToggle accuracies={accuracies} />
        <PeriodicTable
          pseudosMetadata={pseudosMetadata}
          elementsInfo={elementsInfo}
        />
      </HoverProvider>
    </div>
  );
};

const AccuracyToggle: React.FC<TablePageProps> = ({ accuracies }) => {
  const navigate = useNavigate();
  const { activeAccuracy } = useContext(AccuracyContext);
  return (
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
  );
};

export default TablePage;
