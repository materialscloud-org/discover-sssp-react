import { lazy, Suspense, useContext, useState } from "react";
import { Button, Card, Tab, Tabs } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import { LoadingSpinner } from "@sssp/components";
import { ElementsInfoContext, LibraryContext } from "@sssp/context";
import { InvalidPage } from "@sssp/pages";

import styles from "./DetailsPage.module.scss";

const TYPES = [
  "Convergence Summary",
  "Equation of State",
  "Bands Chessboards",
  "Band Structure",
  // "More",
];

const DetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { activeLibrary } = useContext(LibraryContext);
  const { elementsList } = useContext(ElementsInfoContext);
  const defaultTab = "Convergence Summary";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [visitedTabs, setVisitedTabs] = useState(new Set([defaultTab]));
  const [chessboardPseudos, setChessboardPseudos] = useState<string[]>([]);
  const [bandShift, setBandShift] = useState(0);
  const { element } = params;

  const goToTab = (tab: string | null) => {
    if (tab) {
      setActiveTab(tab);
      setVisitedTabs((prev) => {
        if (prev.has(tab)) return prev;
        const next = new Set(prev);
        next.add(tab);
        return next;
      });
    }
  };

  const PlotFactory: React.FC<{ type: string }> = ({ type }) => {
    if (!element) return null;

    let plot: React.ReactNode = null;
    let Plot = null;

    switch (type) {
      case "Convergence Summary":
        Plot = lazy(() => import("@sssp/plotting/ConvergencePlots"));
        plot = <Plot element={element} />;
        break;
      case "Bands Chessboards":
        Plot = lazy(() => import("@sssp/plotting/BandsChessboardPlots"));
        plot = (
          <Plot
            element={element}
            setChessboardPseudos={setChessboardPseudos}
            setBandShift={setBandShift}
            onTileClick={goToTab}
          />
        );
        break;
      case "Equation of State":
        Plot = lazy(() => import("@sssp/plotting/EosPlots"));
        plot = <Plot element={element} />;
        break;
      case "Band Structure":
        Plot = lazy(() => import("@sssp/plotting/BandStructurePlot"));
        plot = (
          <Plot
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

  return element && !elementsList.includes(element) ? (
    <InvalidPage />
  ) : (
    <div id="details-page">
      <Button
        id={styles["back-button"]}
        onClick={() => navigate(`/pseudopotentials/${activeLibrary}`)}
      >
        Back to table
      </Button>
      <div id={styles["element-header"]}>
        <span>Element: {`${element || "None provided"}`}</span>
      </div>
      {element && (
        <Tabs
          id="sssp-pseudos-tabs"
          defaultActiveKey="Convergence Summary"
          activeKey={activeTab}
          onSelect={goToTab}
        >
          {TYPES.map((type: string) => (
            <Tab key={type} eventKey={type} title={type}>
              {visitedTabs.has(type) ? (
                <PlotFactory type={type} />
              ) : (
                <LoadingSpinner />
              )}
            </Tab>
          ))}
        </Tabs>
      )}
    </div>
  );
};

export default DetailsPage;
