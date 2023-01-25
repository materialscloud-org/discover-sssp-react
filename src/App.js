import "./App.css";
import SSSP from "./components/SSSP";

import MaterialsCloudHeader from "react-materialscloud-header";

function App() {
  return (
    <MaterialsCloudHeader
      activeSection={"discover"}
      breadcrumbsPath={[
        { name: "Discover", link: "https://www.materialscloud.org/discover" },
        { name: "SSSP", link: null },
      ]}
    >
      <div className="App">
        <SSSP />
      </div>
    </MaterialsCloudHeader>
  );
}

export default App;
