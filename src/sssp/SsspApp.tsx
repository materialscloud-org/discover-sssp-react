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
import {
  AboutPage,
  AcknowledgementPage,
  CitationPage,
  ContactPage,
  DownloadPage,
  InvalidPage,
  LicensePage,
  PseudosPage,
} from "@sssp/pages";
import "katex/dist/katex.min.css";

import SsspProps from "./SsspApp.models";
import styles from "./SsspApp.module.scss";

const pages = {
  pseudopotentials: {
    tab: "Pseudopotentials",
    path: "pseudopotentials/*",
    element: <PseudosPage />,
  },
  about: {
    tab: "About",
    path: "about",
    element: <AboutPage />,
  },
  download: {
    tab: "Download",
    path: "download",
    element: <DownloadPage />,
  },
  cite: {
    tab: "Cite",
    path: "cite",
    element: <CitationPage />,
  },
  acknowledgements: {
    tab: "Acknowledgements",
    path: "acknowledgements",
    element: <AcknowledgementPage />,
  },
  license: {
    tab: "License",
    path: "license",
    element: <LicensePage />,
  },
  contact: {
    tab: "Contact",
    path: "contact",
    element: <ContactPage />,
  },
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
  const { activeTab, defaultTab, selectTab } = useRoutedTabs(
    Object.fromEntries(
      Object.entries(pages).map(([key, { tab }]) => [key, tab]),
    ),
    {
      segmentIndex: 1,
      rememberLastPath: true,
      resetAfterIndex: true,
    },
  );

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
                  {Object.entries(pages).map(([key, { tab }]) => (
                    <Tab key={key} eventKey={key} title={tab} />
                  ))}
                </Tabs>
              </Card.Header>
              <Card.Body id={styles.ssspCardBody}>
                <Routes>
                  {Object.entries(pages).map(([key, { path, element }]) => (
                    <Route key={key} path={path} element={element} />
                  ))}
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
