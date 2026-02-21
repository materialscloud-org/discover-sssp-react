import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { FamilyContext } from "@sssp/context";
import { InvalidPage } from "@sssp/pages";

import DetailsPage from "./details";
import TablePage from "./table";

const PseudosPage: React.FC = () => {
  const { libraries, activeLibrary } = useContext(FamilyContext);

  return (
    <div id="pseudos-page">
      <Routes>
        {libraries.map((library) => (
          <Route key={library} path={library} element={<TablePage />} />
        ))}
        <Route
          path=":element"
          element={<Navigate to="convergence-summary" replace />}
        />
        <Route path=":element/:tab" element={<DetailsPage />} />
        <Route
          path="/"
          element={
            activeLibrary ? <Navigate to={activeLibrary} replace /> : null
          }
        />
        <Route path="*" element={<InvalidPage />} />
      </Routes>
    </div>
  );
};

export default PseudosPage;
