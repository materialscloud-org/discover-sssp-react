import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { AccuracyContext } from "@sssp/context";

import DetailsPage from "./details";
import TablePage from "./table";

import PseudosPageProps from "./PseudosPage.models";

const PseudosPage: React.FC<PseudosPageProps> = ({ accuracies }) => {
  const { activeAccuracy } = useContext(AccuracyContext);

  return (
    <div id="pseudos-page">
      <Routes>
        {accuracies.map((accuracy) => (
          <Route
            key={accuracy}
            path={accuracy}
            element={<TablePage accuracies={accuracies} />}
          />
        ))}
        <Route
          path=":element"
          element={<DetailsPage accuracies={accuracies} />}
        />
        <Route
          path="/"
          element={
            activeAccuracy ? <Navigate to={activeAccuracy} replace /> : null
          }
        />
      </Routes>
    </div>
  );
};

export default PseudosPage;
