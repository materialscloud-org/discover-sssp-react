import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { LibraryContext, PseudosProvider } from "@sssp/context";
import { InvalidPage } from "@sssp/pages";

import DetailsPage from "./details";
import TablePage from "./table";

import PseudosPageProps from "./PseudosPage.models";

const PseudosPage: React.FC<PseudosPageProps> = ({ libraries }) => {
  const { activeLibrary } = useContext(LibraryContext);

  return (
    <div id="pseudos-page">
      <PseudosProvider>
        <Routes>
          {libraries.map((library) => (
            <Route
              key={library}
              path={library}
              element={<TablePage libraries={libraries} />}
            />
          ))}
          <Route
            path=":element"
            element={<DetailsPage libraries={libraries} />}
          />
          <Route
            path="/"
            element={
              activeLibrary ? <Navigate to={activeLibrary} replace /> : null
            }
          />
          <Route path="*" element={<InvalidPage />} />
        </Routes>
      </PseudosProvider>
    </div>
  );
};

export default PseudosPage;
