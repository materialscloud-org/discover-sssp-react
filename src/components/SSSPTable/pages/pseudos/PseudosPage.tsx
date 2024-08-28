import { Navigate, Route, Routes } from "react-router-dom";

import DetailsPage from "./details";
import TablePage from "./table";

import { PseudosPageProps } from "./PseudosPage.models";

const PseudosPage: React.FC<PseudosPageProps> = ({ accuracies }) => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="efficiency" replace />} />
        {accuracies.map((accuracy) => (
          <Route
            key={accuracy}
            path={accuracy}
            element={
              <TablePage accuracies={accuracies} selectedAccuracy={accuracy} />
            }
          />
        ))}
        <Route path=":element" element={<DetailsPage />} />
      </Routes>
    </>
  );
};

export default PseudosPage;
