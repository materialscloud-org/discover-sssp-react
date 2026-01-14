import { lazy, Suspense } from "react";
import { Card } from "react-bootstrap";

import { LoadingSpinner } from "@sssp/components";

import PlotPaneProps from "./PlotPane.models";

const ConvergencePlots = lazy(() => import("@sssp/plotting/ConvergencePane"));
const BandsChessboardPlots = lazy(
  () => import("@sssp/plotting/BandsChessboardPane")
);
const EosPlots = lazy(() => import("@sssp/plotting/EosPane"));
const BandStructurePlot = lazy(
  () => import("@sssp/plotting/BandStructurePane")
);

const PlotPane: React.FC<PlotPaneProps> = ({
  type,
  element,
  chessboardPseudos,
  bandShift,
  setChessboardPseudos,
  setBandShift,
  onSelectTab,
}) => {
  let plot: React.ReactNode = null;

  switch (type) {
    case "convergence-summary":
      plot = <ConvergencePlots element={element} />;
      break;
    case "band-chessboards":
      plot = (
        <BandsChessboardPlots
          element={element}
          setChessboardPseudos={setChessboardPseudos}
          setBandShift={setBandShift}
          onTileClick={() => {
            onSelectTab("band-structure");
          }}
        />
      );
      break;
    case "equation-of-state":
      plot = <EosPlots element={element} />;
      break;
    case "band-structure":
      plot = (
        <BandStructurePlot
          element={element}
          chessboardPseudos={chessboardPseudos}
          bandShift={bandShift}
        />
      );
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
