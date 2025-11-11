import React, { Suspense, lazy } from "react";
import { Card } from "react-bootstrap";

import { LoadingSpinner } from "@sssp/components";

import PlotFactoryProps from "./PlotFactory.models";

// Defer loading of plot components until needed
const ConvergencePlots = lazy(() => import("./ConvergencePlots"));
const BandsChessboardPlots = lazy(() => import("./BandsChessboardPlots"));
const EquationOfStatePlots = lazy(() => import("./EosPlots"));
const BandStructurePlot = lazy(() => import("./BandStructurePlot"));

const PlotFactory: React.FC<PlotFactoryProps> = ({
  element,
  setActiveTab,
  type,
}) => {
  let plot = null;
  switch (type) {
    case "Convergence Summary":
      plot = <ConvergencePlots element={element} />;
      break;
    case "Bands Chessboards":
      plot = <BandsChessboardPlots setActiveTab={setActiveTab} />;
      break;
    case "Equation of State":
      plot = <EquationOfStatePlots element={element} />;
      break;
    case "Band Structure":
      plot = <BandStructurePlot element={element} />;
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
