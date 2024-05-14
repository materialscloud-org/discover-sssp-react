import { Accordion } from "react-bootstrap";
import { useParams } from "react-router-dom";

import Plots from "./plots/factory";

import "./index.css";

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
  if (!params || !params.element) {
    return <div className="element-info">Missing element</div>;
  }
  const element = params.element;
  return (
    <div>
      <div className="element-info">
        <span>Element: {element}</span>
      </div>
      <div className="mt-4">
        <Accordion defaultActiveKey="overview">
          {TYPES.map((type: string) => (
            <Plots element={element} type={type} key={type} />
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default DetailsPage;
