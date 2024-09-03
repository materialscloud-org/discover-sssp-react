import MaterialsCloudHeader from "mc-react-header";

import { urlBase } from "./common/config";

import Header from "./components/Header";
import SsspApp from "./SsspApp";

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
      title="Standard solid-state pseudopotentials (SSSP)"
      subtitle="A standard solid-state pseudopotentials (SSSP) library optimized for precision or efficiency."
      doi_ids={["f3-ym"]}
      logo={logo}
    />
    <SsspApp urlBase={urlBase} />
  </MaterialsCloudHeader>
);

export default App;
