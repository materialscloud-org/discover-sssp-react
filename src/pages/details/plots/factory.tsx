import React from "react";
import { Accordion } from "react-bootstrap";

import { PlotFactoryProps } from "./models";
import Overview from "./overview";

const Plots: React.FC<PlotFactoryProps> = ({ element, type }) => {
  let header = "";
  let content = null;
  switch (type) {
    case "overview":
      header = "Overview";
      content = <Overview element={element} />;
      break;
    default:
      // console.log(`Invalid plot type: ${type}`);
      return null;
  }
  return (
    <Accordion.Item eventKey={type}>
      <Accordion.Header>{header} plots</Accordion.Header>
      <Accordion.Body>{content}</Accordion.Body>
    </Accordion.Item>
  );
};

export default Plots;
