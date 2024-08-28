import { useState } from "react";
import { Card } from "react-bootstrap";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import { urlBase } from "common/config";

import AboutPage from "pages/about";
import PseudosPage from "pages/pseudos";

import RoutedTabs from "./RoutedTabs";

import styles from "./SSSPTable.module.scss";

const SSSPTable = () => {
  const tabs = ["pseudopotentials", "about"];
  const accuracies = ["efficiency", "precision"];
  const [activeAccuracy, setActiveAccuracy] = useState(accuracies[0]);
  return (
    <Card>
      <Router basename={urlBase}>
        <Card.Header className={styles["tab-controls"]}>
          <RoutedTabs tabs={tabs} defaultTab={tabs[0]} />
        </Card.Header>
        <Card.Body id={styles["sssp-card"]}>
          <Routes>
            <Route
              path="pseudopotentials/*"
              element={
                <PseudosPage
                  accuracies={accuracies}
                  activeAccuracy={activeAccuracy}
                  onAccuracyChange={setActiveAccuracy}
                />
              }
            />
            <Route path="about" element={<AboutPage />} />
            <Route
              path="/"
              element={<Navigate to="pseudopotentials" replace />}
            />
          </Routes>
        </Card.Body>
      </Router>
    </Card>
  );
};

export default SSSPTable;
