import { Alert, Container } from "react-bootstrap";

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
    <Container fluid={"xxl"}>
      <Header
        title={`Standard solid-state pseudopotentials (SSSP v${ssspVersion})`}
        subtitle="A standard solid-state pseudopotentials (SSSP) library optimized for precision or efficiency."
        doi_ids={["f3-ym"]}
        logo={logo}
      />
      <Alert variant="warning" className="text-center">
        The SSSP v2.0 library is in alpha version.{" "}
        <b>Pseudopotential selection may change</b>. For the most recent stable
        version, please visit the{" "}
        <a href="https://legacy.materialscloud.org/discover/sssp/table/efficiency">
          legacy SSSP app
        </a>
        .
      </Alert>
      <SsspApp urlBase={BASE_URL} />
    </Container>
  </MaterialsCloudHeader>
);

export default App;
