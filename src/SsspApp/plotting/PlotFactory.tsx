import React, { Suspense, lazy } from "react";
import { Card } from "react-bootstrap";

import { LoadingSpinner } from "@sssp/components";
import PlotFactoryProps from "./PlotFactory.models";

// Defer loading of plot components until needed
const OverviewPlots = lazy(() => import("./OverviewPlots"));
const BandsChessboardPlots = lazy(() => import("./BandsChessboardPlots"));
const EquationOfStatePlots = lazy(() => import("./EquationOfStatePlots"));
const BandStructurePlot = lazy(() => import("./BandStructurePlot"));

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

  return (
    <Card.Body id="plot-card">
      <Suspense fallback={<LoadingSpinner />}>{plot}</Suspense>
    </Card.Body>
  );
};

export default PlotFactory;
