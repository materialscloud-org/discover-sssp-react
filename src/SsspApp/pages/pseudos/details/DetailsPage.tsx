import { useEffect, useState } from "react";
import {
  Button,
  FormSelect,
  OverlayTrigger,
  Tab,
  Tabs,
  Tooltip,
} from "react-bootstrap";
import { OverlayInjectedProps } from "react-bootstrap/esm/Overlay";
import { BiInfoCircle } from "react-icons/bi";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { capitalize } from "@sssp/common/utils";
import PlotFactory from "@sssp/plotting/PlotFactory";
import SsspDataService from "@sssp/services/data";
import { ElementDataResponse } from "@sssp/services/models";

import DetailsPageProps from "./DetailsPage.models";
import styles from "./DetailsPage.module.scss";

const TYPES = [
  "Overview",
  "Bands Chessboards",
  "Equation of State",
  "Band Structure",
  "More",
];

const DetailsPage: React.FC<DetailsPageProps> = ({ accuracies }) => {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const hashAccuracy = location?.hash.substring(1) || "";
  const [activeAccuracy, setActiveAccuracy] = useState(hashAccuracy);
  const { element } = params;
  const [elementData, setElementData] = useState<ElementDataResponse>();

  useEffect(() => {
    const hashAccuracy = location?.hash.substring(1);
    setActiveAccuracy(hashAccuracy || "");
  }, [location]);

  useEffect(() => {
    if (!element) return;
    const dataService = new SsspDataService(activeAccuracy);
    dataService
      .fetchElementData(element)
      .then((data) => {
        setElementData(data);
      })
      .catch((error) => {
        setElementData(undefined);
        console.error("Error fetching element data", error);
      });
  }, [activeAccuracy, element]);

  return (
    <div id="details-page">
      <div id={styles["details-controls"]}>
        <Button id={styles["back-button"]} onClick={() => navigate("../")}>
          Back to table
        </Button>
        <FormSelect
          id={styles["accuracy-selector"]}
          value={activeAccuracy}
          onChange={(event) => navigate(`#${event.target.value}`)}
        >
          <option value="">Choose accuracy</option>
          {accuracies.map((accuracy) => (
            <option key={accuracy} value={accuracy}>
              {capitalize(accuracy)}
            </option>
          ))}
        </FormSelect>
        <AccuracyInfo />
      </div>
      <div className="sssp-pseudos-header">
        <span>Element: {`${element || "None provided"}`}</span>
      </div>
      {element && (
        <Tabs defaultActiveKey="Overview" id="sssp-pseudos-tabs">
          {TYPES.map((type: string) => (
            <Tab key={type} eventKey={type} title={type}>
              <PlotFactory
                element={element}
                elementData={elementData}
                activeAccuracy={activeAccuracy}
                type={type}
              />
            </Tab>
          ))}
        </Tabs>
      )}
    </div>
  );
};

const AccuracyInfo = () => {
  const showTooltip = (props: OverlayInjectedProps) => (
    <Tooltip id={styles["accuracy-tooltip"]} {...props}>
      The recommended pseudopotential for the selected accuracy will be
      highlighted in the data below
    </Tooltip>
  );

  return (
    <div id={styles["accuracy-info"]}>
      <OverlayTrigger
        placement="right"
        delay={{ show: 100, hide: 100 }}
        overlay={showTooltip}
      >
        <span>
          <BiInfoCircle style={{ cursor: "pointer" }} />
        </span>
      </OverlayTrigger>
    </div>
  );
};

export default DetailsPage;
