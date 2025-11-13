import { useContext, useState } from "react";
import { Button, Tab, Tabs } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import { LoadingSpinner } from "@sssp/components";
import { LibraryContext } from "@sssp/context";
import { InvalidPage } from "@sssp/pages";
import { PlotFactory } from "@sssp/plotting";

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
  const { libraries, activeLibrary } = useContext(LibraryContext);
  const [activeTab, setActiveTab] = useState("Convergence Summary");
  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(
    new Set(["Convergence Summary"])
  );
  const { element } = params;

  const handleTabSelect = (tab: string | null) => {
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

  return activeLibrary && !libraries.includes(activeLibrary) ? (
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
          onSelect={handleTabSelect}
        >
          {TYPES.map((type: string) => (
            <Tab key={type} eventKey={type} title={type}>
              {visitedTabs.has(type) ? (
                <PlotFactory
                  element={element}
                  setActiveTab={setActiveTab}
                  type={type}
                />
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
