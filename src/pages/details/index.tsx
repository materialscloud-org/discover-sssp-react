import { Accordion } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";

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

export const DetailsPage = () => {
  const params = useParams();
  if (!params || !params.element) {
    return <div className="element-info">Missing element</div>;
  }
  const element = params.element;
  return (
    <div>
      <Link to="/discover/sssp/" className="btn btn-primary float-start">
        Back
      </Link>
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
