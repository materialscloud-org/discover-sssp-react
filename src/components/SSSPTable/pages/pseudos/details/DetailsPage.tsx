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
    <>
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
    </>
  );
};

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <Button className={styles["back-button"]} onClick={() => navigate("../")}>
      Back
    </Button>
  );
};

const Header = ({ element }: { element?: string }) => {
  return (
    <div className={styles["sssp-header"]}>
      <span>Element: {`${element || "None provided"}`}</span>
    </div>
  );
};

export default DetailsPage;
