import { Alert, Container } from "react-bootstrap";
import { BrowserRouter, Link } from "react-router-dom";

import MaterialsCloudHeader from "mc-react-header";

import { BASE_URL } from "@sssp/common/config";

import { Header } from "./components";
import SsspApp, { ssspVersion } from "./sssp";

import logo from "./assets/images/sssp_logo.png";

import "./App.scss";

const App = () => (
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
    <BrowserRouter basename={BASE_URL}>
      <Container fluid={"xxl"}>
        <Header
          title={`Standard solid-state pseudopotentials (SSSP v${ssspVersion})`}
          subtitle="A standard solid-state pseudopotentials (SSSP) library optimized for precision or efficiency."
          doi_ids={["f3-ym"]}
          logo={logo}
        />
        <Alert variant="warning" className="text-center">
          The SSSP v2.0 library is in alpha version.{" "}
          <b>Pseudopotential selection may change</b>. For the most recent
          stable version, please visit the{" "}
          <Link to="/download">Download tab</Link>.
        </Alert>
        <SsspApp />
      </Container>
    </BrowserRouter>
  </MaterialsCloudHeader>
);

export default App;
