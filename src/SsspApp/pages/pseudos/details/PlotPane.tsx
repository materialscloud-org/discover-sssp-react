import { lazy, Suspense } from "react";
import { Card } from "react-bootstrap";

import { LoadingSpinner } from "@sssp/components";

import PlotPaneProps from "./PlotPane.models";

const ConvergencePlots = lazy(() => import("@sssp/plotting/ConvergencePane"));
const BandsChessboardPlots = lazy(
  () => import("@sssp/plotting/BandsChessboardPane"),
);
const EosPlots = lazy(() => import("@sssp/plotting/EosPane"));
const BandStructurePlot = lazy(
  () => import("@sssp/plotting/BandStructurePane"),
);

const PlotPane: React.FC<PlotPaneProps> = ({ type, onSelectTab }) => {
  let plot: React.ReactNode = null;

  switch (type) {
    case "convergence-summary":
      plot = <ConvergencePlots />;
      break;
    case "equation-of-state":
      plot = <EosPlots />;
      break;
    case "band-chessboards":
      plot = (
        <BandsChessboardPlots
          onTileClick={() => {
            onSelectTab("band-structure");
          }}
        />
      );
      break;
    case "band-structure":
      plot = <BandStructurePlot />;
      break;
    default:
      console.error(`Invalid plot type: ${type}`);
      plot = null;
  }

  return (
    <Card.Body id="plot-card">
      <Suspense fallback={<LoadingSpinner />}>{plot}</Suspense>
    </Card.Body>
  );
};

export default PlotPane;
