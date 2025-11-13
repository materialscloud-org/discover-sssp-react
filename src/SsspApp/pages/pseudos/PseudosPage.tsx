import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import {
  ElementsInfoProvider,
  LibraryContext,
  PseudosProvider,
} from "@sssp/context";
import { InvalidPage } from "@sssp/pages";

import DetailsPage from "./details";
import TablePage from "./table";

const PseudosPage: React.FC = () => {
  const { libraries, activeLibrary } = useContext(LibraryContext);

  return (
    <div id="pseudos-page">
      <PseudosProvider>
        <ElementsInfoProvider>
          <Routes>
            {libraries.map((library) => (
              <Route key={library} path={library} element={<TablePage />} />
            ))}
            <Route path=":element" element={<DetailsPage />} />
            <Route
              path="/"
              element={
                activeLibrary ? <Navigate to={activeLibrary} replace /> : null
              }
            />
            <Route path="*" element={<InvalidPage />} />
          </Routes>
        </ElementsInfoProvider>
      </PseudosProvider>
    </div>
  );
};

export default PseudosPage;
