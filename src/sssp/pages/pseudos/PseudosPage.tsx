import { useContext, useEffect, useMemo } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";

import { FamilyContext } from "@sssp/context";
import { InvalidPage } from "@sssp/pages";

import DetailsPage from "./details";
import TablePage from "./table";

const PseudosPage: React.FC = () => {
  const { defaultFunctional } = useContext(FamilyContext);

  return (
    <div id="pseudos-page">
      <Routes>
        <Route index element={<Navigate to={defaultFunctional} replace />} />
        <Route path=":functional/*" element={<PseudosFunctionalRoutes />} />
        <Route path="*" element={<InvalidPage />} />
      </Routes>
    </div>
  );
};

const PseudosFunctionalRoutes: React.FC = () => {
  const location = useLocation();
  const params = useParams();
  const functionalParam = params.functional;

  const { libraries, activeLibrary, functionals, setActiveFunctional } =
    useContext(FamilyContext);

  const canonicalFunctional = useMemo(() => {
    if (!functionalParam) return undefined;
    return functionals.find(
      (f) => f.toLowerCase() === functionalParam.toLowerCase(),
    );
  }, [functionalParam, functionals]);

  const redirectTarget = useMemo(() => {
    if (!canonicalFunctional) return null;
    if (!functionalParam) return null;
    if (functionalParam === canonicalFunctional) return null;

    // Canonicalize to the configured casing (e.g. /pseudopotentials/pbe/... -> /pseudopotentials/PBE/...)
    return location.pathname.replace(
      /^(.*\/pseudopotentials\/)[^/]+/i,
      `$1${canonicalFunctional}`,
    );
  }, [canonicalFunctional, functionalParam, location.pathname]);

  useEffect(() => {
    if (canonicalFunctional) {
      setActiveFunctional(canonicalFunctional);
    }
  }, [canonicalFunctional, setActiveFunctional]);

  return !canonicalFunctional ? (
    <InvalidPage />
  ) : redirectTarget ? (
    <Navigate
      to={{
        pathname: redirectTarget,
        search: location.search,
        hash: location.hash,
      }}
      replace
    />
  ) : (
    <Routes>
      {libraries.map((library) => (
        <Route key={library} path={library} element={<TablePage />} />
      ))}
      <Route
        index
        element={activeLibrary ? <Navigate to={activeLibrary} replace /> : null}
      />
      <Route
        path=":element"
        element={<Navigate to="convergence-summary" replace />}
      />
      <Route path=":element/:tab" element={<DetailsPage />} />
      <Route path="*" element={<InvalidPage />} />
    </Routes>
  );
};

export default PseudosPage;
