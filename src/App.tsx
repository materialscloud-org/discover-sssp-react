import MaterialsCloudHeader from "mc-react-header";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import { DetailsPage } from "./pages/details";
import { TablePage } from "./pages/table";

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
          name: "SSSP Efficiency",
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
          <Tabs defaultActiveKey="table">
            <Tab eventKey="table" title="Table">
              <div className="body">
                {/* <div className="description"></div> */}
                <BrowserRouter>
                  <Routes>
                    <Route path="discover/sssp/">
                      <Route path="" element={<TablePage />} />
                      <Route path=":element" element={<DetailsPage />} />
                    </Route>
                  </Routes>
                </BrowserRouter>
              </div>
            </Tab>
            <Tab eventKey="about" title="About">
              <div className="description">
                The SSSP Efficiency library is a subset of the SSSP library
                optimized for efficiency. It is based on the SSSP v1.1 library
                and is generated using the same methodology. The SSSP Efficiency
                library is a subset of the SSSP library optimized for
                efficiency. It is based on the SSSP v1.1 library and is
                generated using the same methodology.
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </MaterialsCloudHeader>
  );
}

export default App;
