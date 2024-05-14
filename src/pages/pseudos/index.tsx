import { Route, Routes } from "react-router-dom";

import DetailsPage from "./details";
import TablePage from "./table";

import "./index.css";

const PseudosPage = () => {
  return (
    <div className="pseudos">
      <div className="instructions">Instructions placeholder</div>
      <Routes>
        <Route path="" element={<TablePage />} />
        <Route path=":element" element={<DetailsPage />} />
      </Routes>
    </div>
  );
};

export default PseudosPage;
