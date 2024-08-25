import MaterialsCloudHeader from "mc-react-header";

import Header from "components/Header";
import SSSPTable from "components/SSSPTable";

import logo from "assets/images/sssp_logo.png";

import styles from "./App.module.scss";

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
      <div className={styles["app"]}>
        <div className={styles["main-page"]}>
          <Header
            title="Standard solid-state pseudopotentials (SSSP)"
            subtitle="A standard solid-state pseudopotentials (SSSP) library optimized for precision or efficiency."
            doi_ids={["f3-ym"]}
            logo={logo}
          />
          <SSSPTable />
        </div>
      </div>
    </MaterialsCloudHeader>
  );
}

export default App;
