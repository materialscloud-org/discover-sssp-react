import { Route, Routes } from "react-router-dom";

import DetailsPage from "./details";
import TablePage from "./table";

import useSSSPTypeLocation from "./useSSSPTypeLocation";

import { ssspVersion } from "components/SSSPTable";

import styles from "./index.module.scss";

const PseudosPage = () => {
  const ssspType = useSSSPTypeLocation();
  return (
    <div>
      <div id={styles["sssp-header"]}>
        SSSP {ssspType} (v{ssspVersion})
      </div>
      <Routes>
        <Route path="" element={<TablePage ssspType={ssspType} />} />
        <Route path=":element" element={<DetailsPage />} />
      </Routes>
    </div>
  );
};

export default PseudosPage;
