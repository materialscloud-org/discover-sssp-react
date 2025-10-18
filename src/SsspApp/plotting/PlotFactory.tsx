import React from "react";
import { Card } from "react-bootstrap";

import { LoadingSpinner } from "@sssp/components";

import BandsChessboardPlots from "./BandsChessboardPlots";
import BandStructurePlot from "./BandStructurePlot";
import EquationOfStatePlots from "./EquationOfStatePlots";
import OverviewPlots from "./OverviewPlots";
import PlotFactoryProps from "./PlotFactory.models";

const PlotFactory: React.FC<PlotFactoryProps> = ({
  element,
  elementData,
  activeAccuracy,
  type,
}) => {
  if (!elementData) {
    return (
      <Card.Body id="plot-card">
        <LoadingSpinner />
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
    case "Band Structure":
      plot = (
        <BandStructurePlot element={element} activeAccuracy={activeAccuracy} />
      );
      break;
    default:
      console.error(`Invalid plot type: ${type}`);
  }

  return <Card.Body id="plot-card">{plot}</Card.Body>;
};

export default PlotFactory;
