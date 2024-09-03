import { Card } from "react-bootstrap";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import { urlBase } from "common/config";

import AccuracyContext from "context/AccuracyContext";
import useAccuracy from "context/useAccuracy";

import AboutPage from "pages/about";
import PseudosPage from "pages/pseudos";

import RoutedTabs from "./RoutedTabs";

import styles from "./SSSPTable.module.scss";

const SSSPTable = () => {
  const tabs = ["pseudopotentials", "about"];
  const accuracies = ["efficiency", "precision"];
  const accuracyContext = useAccuracy("efficiency");
  return (
    <Card id={styles["sssp-app"]}>
      <Router basename={urlBase}>
        <Card.Header id={styles["tab-controls"]}>
          <RoutedTabs tabs={tabs} defaultTab={tabs[0]} />
        </Card.Header>
        <Card.Body id={styles["sssp-card"]}>
          <AccuracyContext.Provider value={accuracyContext}>
            <Routes>
              <Route
                path="pseudopotentials/*"
                element={<PseudosPage accuracies={accuracies} />}
              />
              <Route path="about" element={<AboutPage />} />
              <Route
                path="/"
                element={<Navigate to="pseudopotentials" replace />}
              />
            </Routes>
          </AccuracyContext.Provider>
        </Card.Body>
      </Router>
    </Card>
  );
};

export default SSSPTable;
