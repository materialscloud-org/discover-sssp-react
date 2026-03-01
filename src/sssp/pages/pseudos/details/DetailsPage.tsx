import { useContext, useEffect } from "react";
import { Button, Tab, Tabs } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import { useRoutedTabs } from "@sssp/common/hooks";
import { ElementContext, FamilyContext } from "@sssp/context";

import styles from "./DetailsPage.module.scss";
import ElementSelector from "./ElementSelector";
import PlotPane from "./PlotPane";
import { elementSymbols } from "@sssp/common/symbols";

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
  const { activeLibrary, activeFunctional } = useContext(FamilyContext);
  const { setElement } = useContext(ElementContext);

  useEffect(() => {
    const element = params.element || "";
    if (!elementSymbols.includes(element)) {
      navigate("/", { replace: true });
      return;
    }
    setElement(element);
  }, [navigate, params.element, setElement]);

  const { activeTab, defaultTab, selectTab } = useRoutedTabs(tabs, {
    segmentIndex: 4,
    resetAfterIndex: true,
  });

  return (
    <div id={styles.detailsPage}>
      <Button
        id={styles.backButton}
        onClick={() =>
          navigate(`/pseudopotentials/${activeFunctional}/${activeLibrary}`)
        }
      >
        Back to table
      </Button>
      <div id={styles.elementHeader}>
        <div id={styles.elementLabel}>Element:</div>
        <ElementSelector navigate={navigate} activeTab={activeTab} />
      </div>
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
            <PlotPane type={key} onSelectTab={selectTab} />
          </Tab>
        ))}
      </Tabs>
    </div>
  );
};

export default DetailsPage;
