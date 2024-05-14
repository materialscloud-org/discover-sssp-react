import { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import {
  Link,
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";

import MaterialsCloudHeader from "mc-react-header";

import AboutPage from "./pages/about";
import EfficiencyPage from "./pages/efficiency";
import PrecisionPage from "./pages/precision";

import Header from "./components/header";

import logo from "./assets/images/sssp_logo.png";

import "./App.css";

const BASE_PATH = "discover/sssp";

function App() {
  return (
    <MaterialsCloudHeader
      activeSection={"discover"}
      breadcrumbsPath={[
        { name: "Discover", link: "https://www.materialscloud.org/discover" },
        {
          name: "SSSP",
          link: null,
        },
      ]}
    >
      <div className="App">
        <div className="main-page">
          <Header
            title="Standard solid-state pseudopotentials (SSSP)"
            subtitle="A standard solid-state pseudopotentials (SSSP) library optimized for precision or efficiency."
            doi_ids={["f3-ym"]}
            logo={logo}
          />
          <Router>
            <RoutedTabs />
            <Routes>
              <Route path="discover/sssp">
                <Route path="efficiency/*" element={<EfficiencyPage />} />
                <Route path="precision/*" element={<PrecisionPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="" element={<Navigate replace to="efficiency" />} />
              </Route>
            </Routes>
          </Router>
        </div>
      </div>
    </MaterialsCloudHeader>
  );
}

const RoutedTabs = () => {
  const [activeTab, setActiveTab] = useState("efficiency");
  const location = useLocation();

  useEffect(() => {
    const route = location.pathname.split(BASE_PATH)[1];
    switch (route.split("/")[1]) {
      case "efficiency":
        setActiveTab("efficiency");
        break;
      case "precision":
        setActiveTab("precision");
        break;
      case "about":
        setActiveTab("about");
        break;
      default:
        setActiveTab("efficiency");
        break;
    }
  }, [location]);

  return (
    <Tabs defaultActiveKey="efficiency" activeKey={activeTab}>
      <Tab
        eventKey="efficiency"
        title={<Link to="discover/sssp/efficiency/table">Efficiency</Link>}
      />
      <Tab
        eventKey="precision"
        title={<Link to="discover/sssp/precision/table">Precision</Link>}
      />
      <Tab
        eventKey="about"
        title={<Link to="discover/sssp/about">About</Link>}
      />
    </Tabs>
  );
};

export default App;
