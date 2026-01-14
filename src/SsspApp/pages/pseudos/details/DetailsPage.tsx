import { useContext, useEffect, useState } from "react";
import { Button, Dropdown, Tab, Tabs } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import { useRoutedTabs } from "@sssp/common/hooks";
import { elementSymbols } from "@sssp/common/symbols";
import { LibraryContext } from "@sssp/context";
import { InvalidPage } from "@sssp/pages";

import styles from "./DetailsPage.module.scss";
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
  const [chessboardPseudos, setChessboardPseudos] = useState<string[]>([]);
  const [bandShift, setBandShift] = useState(0);

  useEffect(() => {
    setChessboardPseudos([]);
    setBandShift(0);
  }, [element]);

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
        <Dropdown>
          <Dropdown.Toggle
            className={styles["element-dropdown-toggle"]}
            variant="success"
            size="lg"
          >
            {element || "None provided"}
          </Dropdown.Toggle>
          <Dropdown.Menu className={styles["element-dropdown-menu"]}>
            {elementSymbols.slice(1).map((el) => (
              <Dropdown.Item
                key={el}
                onClick={() => navigate(`/pseudopotentials/${el}/${activeTab}`)}
                active={el === element}
              >
                {el}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      {element && (
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
                chessboardPseudos={chessboardPseudos}
                bandShift={bandShift}
                setChessboardPseudos={setChessboardPseudos}
                setBandShift={setBandShift}
                onSelectTab={selectTab}
              />
            </Tab>
          ))}
        </Tabs>
      )}
    </div>
  );
};

export default DetailsPage;
