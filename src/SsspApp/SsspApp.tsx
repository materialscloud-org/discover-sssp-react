import { Card } from "react-bootstrap";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import "@sssp/assets/styles/main.scss";
import RoutedTabs from "@sssp/components/RoutedTabs";
import { AccuracyProvider } from "@sssp/context";
import AboutPage from "@sssp/pages/about";
import PseudosPage from "@sssp/pages/pseudos";

import SsspProps from "./SsspApp.models";
import styles from "./SsspApp.module.scss";

const SsspApp: React.FC<SsspProps> = ({ urlBase }) => {
  const tabs = ["pseudopotentials", "about"];
  const accuracies = ["efficiency", "precision"];
  return (
    <Card id={styles["sssp-app"]}>
      <Router basename={urlBase}>
        <Card.Header id={styles["tab-controls"]}>
          <RoutedTabs tabs={tabs} defaultTab={tabs[0]} />
        </Card.Header>
        <Card.Body id="sssp-card">
          <AccuracyProvider defaultAccuracy={accuracies[0]}>
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
          </AccuracyProvider>
        </Card.Body>
      </Router>
    </Card>
  );
};

export default SsspApp;
