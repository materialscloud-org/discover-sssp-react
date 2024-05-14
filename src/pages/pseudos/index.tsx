import { Route, Routes } from "react-router-dom";

import DetailsPage from "./details";
import TablePage from "./table";

const PseudosPage = () => {
  return (
    <Routes>
      <Route path="" element={<TablePage />} />
      <Route path=":element" element={<DetailsPage />} />
    </Routes>
  );
};

export default PseudosPage;
