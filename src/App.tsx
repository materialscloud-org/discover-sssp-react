import { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import MaterialsCloudHeader from "mc-react-header";

import { urlBase } from "./common/config";

import AboutPage from "./pages/about";
import PseudosPage from "./pages/pseudos";

import Header from "./components/header";

import logo from "./assets/images/sssp_logo.png";

import "./App.css";

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
                <Route path="efficiency/*" element={<PseudosPage />} />
                <Route path="precision/*" element={<PseudosPage />} />
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
  const [active, setActive] = useState("efficiency");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const route = location.pathname.split(urlBase)[1];
    const root = route.split("/")[1];
    setActive(root);
  }, [location]);

  return (
    <Tabs
      defaultActiveKey="efficiency"
      activeKey={active}
      onSelect={(key) => navigate(`${urlBase}/${key}`)}
    >
      <Tab eventKey="efficiency" title="Efficiency" />
      <Tab eventKey="precision" title="Precision" />
      <Tab eventKey="about" title="About" />
    </Tabs>
  );
};

export default App;
