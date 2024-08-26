import { Route, Routes, useLocation } from "react-router-dom";

import DetailsPage from "./details";
import TablePage from "./table";

import { ssspVersion } from "components/SSSPTable";

import styles from "./index.module.scss";

const PseudosPage = () => {
  const ssspType = useLocation().pathname.split("/")[3];
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  return (
    <div>
      <div id={styles["sssp-header"]}>
        SSSP {capitalize(ssspType)} (v{ssspVersion})
      </div>
      <Routes>
        <Route path="" element={<TablePage />} />
        <Route path=":element" element={<DetailsPage />} />
      </Routes>
    </div>
  );
};

export default PseudosPage;
