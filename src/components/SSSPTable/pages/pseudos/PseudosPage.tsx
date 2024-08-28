import { Navigate, Route, Routes } from "react-router-dom";

import DetailsPage from "./details";
import TablePage from "./table";

import { PseudosPageProps } from "./PseudosPage.models";

const PseudosPage: React.FC<PseudosPageProps> = ({
  accuracies,
  activeAccuracy,
  onAccuracyChange,
}) => {
  return (
    <>
      <Routes>
        {accuracies.map((accuracy) => (
          <Route
            key={accuracy}
            path={accuracy}
            element={
              <TablePage
                accuracies={accuracies}
                activeAccuracy={accuracy}
                onAccuracyToggle={onAccuracyChange}
              />
            }
          />
        ))}
        <Route path=":element" element={<DetailsPage />} />
        <Route
          path="/"
          element={
            activeAccuracy ? <Navigate to={activeAccuracy} replace /> : null
          }
        />
      </Routes>
    </>
  );
};

export default PseudosPage;
