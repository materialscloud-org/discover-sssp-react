import React from "react";
import { Card, Spinner } from "react-bootstrap";

import { PlotFactoryProps } from "./PlotFactory.models";

import BandsChessboardPlots from "./BandsChessboardPlots";
import EquationOfStatePlots from "./EquationOfStatePlots";
import OverviewPlots from "./OverviewPlots";

const PlotFactory: React.FC<PlotFactoryProps> = ({
  element,
  elementData,
  activeAccuracy,
  type,
}) => {
  if (!elementData) {
    return (
      <Card.Body id="plot-card">
        <div className="loading">
          Loading
          <Spinner className="spinner" animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      </Card.Body>
    );
  }

  let plot = null;
  switch (type) {
    case "Overview":
      plot = (
        <OverviewPlots
          element={element}
          elementData={elementData}
          activeAccuracy={activeAccuracy}
        />
      );
      break;
    case "Bands Chessboards":
      plot = (
        <BandsChessboardPlots
          element={element}
          elementData={elementData}
          activeAccuracy={activeAccuracy}
        />
      );
      break;
    case "Equation of State":
      plot = (
        <EquationOfStatePlots
          element={element}
          activeAccuracy={activeAccuracy}
        />
      );
      break;
    default:
      console.error(`Invalid plot type: ${type}`);
  }

  return <Card.Body id="plot-card">{plot}</Card.Body>;
};

export default PlotFactory;
