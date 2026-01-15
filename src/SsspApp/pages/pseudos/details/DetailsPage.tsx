import { useContext } from "react";
import { Button, Tab, Tabs } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import { useRoutedTabs } from "@sssp/common/hooks";
import { elementSymbols } from "@sssp/common/symbols";
import { LibraryContext, PlottingProvider } from "@sssp/context";
import { InvalidPage } from "@sssp/pages";

import styles from "./DetailsPage.module.scss";
import ElementSelector from "./ElementSelector";
import PlotPane from "./PlotPane";

const tabs = {
  "convergence-summary": "Convergence Summary",
  "equation-of-state": "Equation of State",
  "band-chessboards": "Band Chessboards",
  "band-structure": "Band Structure",
  // "More",
};

const DetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { activeLibrary } = useContext(LibraryContext);
  const { element } = params;
  const { activeTab, defaultTab, selectTab } = useRoutedTabs(tabs, {
    segmentIndex: 3,
    resetAfterIndex: true,
  });

  return element && !elementSymbols.includes(element) ? (
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
        <div id={styles["element-label"]}>Element:</div>
        <ElementSelector
          element={element}
          navigate={navigate}
          activeTab={activeTab}
        />
      </div>
      {element && (
        <PlottingProvider element={element}>
          <Tabs
            id="sssp-pseudos-tabs"
            defaultActiveKey={defaultTab}
            activeKey={activeTab}
            onSelect={selectTab}
            mountOnEnter
            unmountOnExit
          >
            {Object.entries(tabs).map(([key, title]) => (
              <Tab key={key} eventKey={key} title={title}>
                <PlotPane
                  type={key}
                  element={element}
                  onSelectTab={selectTab}
                />
              </Tab>
            ))}
          </Tabs>
        </PlottingProvider>
      )}
    </div>
  );
};

export default DetailsPage;
