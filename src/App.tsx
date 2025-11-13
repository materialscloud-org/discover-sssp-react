import MaterialsCloudHeader from "mc-react-header";

import { BASE_URL } from "@sssp/common/config";

import Header from "./components/Header";
import SsspApp, { ssspVersion } from "./SsspApp";

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
    <Header
      title={`Standard solid-state pseudopotentials (SSSP v${ssspVersion})`}
      subtitle="A standard solid-state pseudopotentials (SSSP) library optimized for precision or efficiency."
      doi_ids={["f3-ym"]}
      logo={logo}
    />
    <SsspApp urlBase={BASE_URL} />
  </MaterialsCloudHeader>
);

export default App;
