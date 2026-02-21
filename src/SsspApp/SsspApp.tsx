import { Card, Tab, Tabs } from "react-bootstrap";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import "@sssp/assets/styles/main.scss";
import { useRoutedTabs } from "@sssp/common/hooks";
import {
  ElementProvider,
  FamilyProvider,
  PlotProvider,
  PseudoProvider,
} from "@sssp/context";
import { AboutPage, DownloadPage, InvalidPage, PseudosPage } from "@sssp/pages";

import SsspProps from "./SsspApp.models";
import styles from "./SsspApp.module.scss";

const tabs = {
  pseudopotentials: "Pseudopotentials",
  download: "Download",
  about: "About",
};

const SsspApp: React.FC<SsspProps> = ({ urlBase }) => {
  return (
    <Card id={styles.ssspApp}>
      <BrowserRouter basename={urlBase}>
        <SsspAppContent />
      </BrowserRouter>
    </Card>
  );
};

export default SsspApp;

const SsspAppContent: React.FC = () => {
  const { activeTab, defaultTab, selectTab } = useRoutedTabs(tabs, {
    segmentIndex: 1,
    rememberLastPath: true,
    resetAfterIndex: true,
  });

  return (
    <>
      <FamilyProvider>
        <ElementProvider>
          <PseudoProvider>
            <PlotProvider>
              <Card.Header id={styles.tabControls}>
                <Tabs
                  id="main-tabs"
                  defaultActiveKey={defaultTab}
                  activeKey={activeTab}
                  onSelect={selectTab}
                >
                  {Object.entries(tabs).map(([key, value]) => (
                    <Tab key={key} eventKey={key} title={value} />
                  ))}
                </Tabs>
              </Card.Header>
              <Card.Body id={styles.ssspCardBody}>
                <Routes>
                  <Route path="pseudopotentials/*" element={<PseudosPage />} />
                  <Route path="download" element={<DownloadPage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route
                    path="/"
                    element={<Navigate to="pseudopotentials" replace />}
                  />
                  <Route path="*" element={<InvalidPage />} />
                </Routes>
              </Card.Body>
            </PlotProvider>
          </PseudoProvider>
        </ElementProvider>
      </FamilyProvider>
    </>
  );
};
