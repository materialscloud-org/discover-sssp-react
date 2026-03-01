import { useContext, useEffect } from "react";
import { Button, Tab, Tabs } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";

import { useRoutedTabs } from "@sssp/common/hooks";
import { elementSymbols } from "@sssp/common/symbols";
import { ElementContext, FamilyContext } from "@sssp/context";

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
  const { activeLibrary, activeFunctional, functionals } =
    useContext(FamilyContext);
  const { element, setElement } = useContext(ElementContext);
  const elementValue = element || params.element || "";

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
      <div id={styles.detailControls}>
        <div id={styles.elementSelector} className={styles.selectorContainer}>
          <div className={styles.selectorLabel}>Element:</div>
          <Select
            className={styles.selector}
            value={{ value: elementValue, label: elementValue }}
            options={elementSymbols
              .slice(1)
              .sort()
              .map((el) => ({ value: el, label: el }))}
            onChange={(selectedOption) => {
              const selectedElement = selectedOption?.value;
              if (selectedElement) {
                navigate(
                  `/pseudopotentials/${activeFunctional}/${selectedElement}/${activeTab}`,
                );
              }
            }}
            isSearchable
          />
        </div>
        <div
          id={styles.functionalSelector}
          className={styles.selectorContainer}
        >
          <div className={styles.selectorLabel}>Functional:</div>
          <Select
            className={styles.selector}
            value={{
              value: activeFunctional,
              label: activeFunctional.toUpperCase(),
            }}
            options={functionals.map((functional) => ({
              value: functional,
              label: functional.toUpperCase(),
            }))}
            onChange={(selectedOption) => {
              const selectedFunctional = selectedOption?.value;
              if (selectedFunctional && elementValue) {
                navigate(
                  `/pseudopotentials/${selectedFunctional}/${elementValue}/${activeTab}`,
                );
              }
            }}
            isSearchable
          />
        </div>
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
