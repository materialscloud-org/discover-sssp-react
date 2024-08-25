import { Card } from "react-bootstrap";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import AboutPage from "pages/about";
import PseudosPage from "pages/pseudos";

import RoutedTabs from "./RoutedTabs";

import styles from "./SSSPTable.module.scss";

const SSSPTable = () => {
  return (
    <Card className="mt-3">
      <Router>
        <Card.Header className={styles["tab-controls"]}>
          <RoutedTabs />
        </Card.Header>
        <Card.Body id={styles["main-card"]} className="p-4">
          <Routes>
            <Route path="discover/sssp">
              <Route path="efficiency/*" element={<PseudosPage />} />
              <Route path="precision/*" element={<PseudosPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="" element={<Navigate replace to="efficiency" />} />
            </Route>
          </Routes>
        </Card.Body>
      </Router>
    </Card>
  );
};

export default SSSPTable;
