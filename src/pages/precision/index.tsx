import { Route, Routes } from "react-router-dom";

import DetailsPage from "../details";
import TablePage from "./table";

const PrecisionPage = () => {
  return (
    <div className="body">
      {/* <div className="description"></div> */}
      <Routes>
        <Route path="" element={<TablePage />} />
        <Route path=":element" element={<DetailsPage />} />
      </Routes>
    </div>
  );
};

export default PrecisionPage;
