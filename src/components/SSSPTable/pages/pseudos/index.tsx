import { Navigate, Route, Routes } from "react-router-dom";

import DetailsPage from "./details";
import TablePage from "./table";

const PseudosPage = () => {
  const ssspType = useSSSPTypeLocation();
  return (
    <div>
      <Routes>
        <Route path="efficiency" element={<TablePage />} />
        <Route path="precision" element={<TablePage />} />
        <Route path=":element" element={<DetailsPage />} />
        <Route path="/" element={<Navigate to="efficiency" replace />} />
      </Routes>
    </div>
  );
};

export default PseudosPage;
