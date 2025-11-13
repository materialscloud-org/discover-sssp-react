import { Card } from "react-bootstrap";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import "@sssp/assets/styles/main.scss";

import { RoutedTabs } from "@sssp/components";
import { LibraryProvider } from "@sssp/context";
import { AboutPage, InvalidPage, PseudosPage } from "@sssp/pages";

import SsspProps from "./SsspApp.models";
import styles from "./SsspApp.module.scss";

const SsspApp: React.FC<SsspProps> = ({ urlBase }) => {
  const tabs = ["pseudopotentials", "about"];
  return (
    <Card id={styles["sssp-app"]}>
      <Router basename={urlBase}>
        <Card.Header id={styles["tab-controls"]}>
          <RoutedTabs tabs={tabs} defaultTab={tabs[0]} />
        </Card.Header>
        <Card.Body id={styles["sssp-card"]}>
          <Routes>
            <Route
              path="pseudopotentials/*"
              element={
                <LibraryProvider>
                  <PseudosPage />
                </LibraryProvider>
              }
            />
            <Route path="about" element={<AboutPage />} />
            <Route
              path="/"
              element={<Navigate to="pseudopotentials" replace />}
            />
            <Route path="*" element={<InvalidPage />} />
          </Routes>
        </Card.Body>
      </Router>
    </Card>
  );
};

export default SsspApp;
