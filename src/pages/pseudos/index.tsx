import { Route, Routes } from "react-router-dom";

import DetailsPage from "./details";
import TablePage from "./table";

import styles from "./index.module.scss";

const PseudosPage = () => {
  return (
    <div>
      <div className={styles.instructions}>Instructions placeholder</div>
      <Routes>
        <Route path="" element={<TablePage />} />
        <Route path=":element" element={<DetailsPage />} />
      </Routes>
    </div>
  );
};

export default PseudosPage;
