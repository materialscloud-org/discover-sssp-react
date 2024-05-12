import MaterialsCloudHeader from "mc-react-header";
import pseudo_metadata from "./data/metadata.json";
import sssp_efficiency from "./data/sssp_efficiency.json";

import { PTable } from "./components/ptable";

import "./App.css";

function App() {
  return (
    <MaterialsCloudHeader
      activeSection={"discover"}
      breadcrumbsPath={[
        { name: "Discover", link: "https://www.materialscloud.org/discover" },
        { name: "SSSP Efficiency", link: null },
      ]}
    >
      <div className="App">
        <PTable
          ssspData={sssp_efficiency}
          pseudoMetadata={pseudo_metadata}
          linkBase="https://www.materialscloud.org/discover/sssp/plot/efficiency"
        />
      </div>
    </MaterialsCloudHeader>
  );
}

export default App;
