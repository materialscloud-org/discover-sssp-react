import { Accordion, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import Plots from "./plots/factory";

import styles from "./DetailsPage.module.scss";

const TYPES = [
  "overview",
  "eos",
  "bands",
  "cohesive",
  "cohesive-per",
  "phonons",
  "phonons-per",
  "pressure",
  "pressure-per",
];

const DetailsPage = () => {
  const params = useParams();
  const { element } = params;
  return (
    <div id="details-page">
      <BackButton />
      <Header element={element} />
      {element && (
        <div className="mt-4">
          <Accordion defaultActiveKey="overview">
            {TYPES.map((type: string) => (
              <Plots element={element} type={type} key={type} />
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
};

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <Button id={styles["back-button"]} onClick={() => navigate("../")}>
      Back
    </Button>
  );
};

const Header = ({ element }: { element?: string }) => (
  <div className="sssp-pseudos-header">
    <span>Element: {`${element || "None provided"}`}</span>
  </div>
);

export default DetailsPage;
