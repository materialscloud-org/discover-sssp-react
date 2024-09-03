import { useEffect, useState } from "react";
import { Button, Tab, Tabs, FormSelect } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { capitalize } from "common/utils";

import { DetailsPageProps } from "./DetailsPage.models";

import Plots from "./plots/factory";

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
  const hashAccuracy = location?.hash.substring(1);
  const [activeAccuracy, setActiveAccuracy] = useState(hashAccuracy || "");
  const { element } = params;

  useEffect(() => {
    const hashAccuracy = location?.hash.substring(1);
    setActiveAccuracy(hashAccuracy || "");
  }, [location]);

  return (
    <div id="details-page">
      <div id={styles["details-controls"]}>
        <Button id={styles["back-button"]} onClick={() => navigate("../")}>
          Back
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
      </div>
      <div className="sssp-pseudos-header">
        <span>Element: {`${element || "None provided"}`}</span>
      </div>
      {element && (
        <Tabs defaultActiveKey="Overview" id="sssp-pseudos-tabs">
          {TYPES.map((type: string) => (
            <Tab key={type} eventKey={type} title={type}>
              <Plots element={element} type={type} key={type} />
            </Tab>
          ))}
        </Tabs>
      )}
    </div>
  );
};

export default DetailsPage;
