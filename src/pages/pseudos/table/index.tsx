import { useLocation } from "react-router-dom";

import PTable from "components/PeriodicTable";

import pseudo_metadata from "data/metadata.json";
import sssp_efficiency from "data/sssp_efficiency.json";
import sssp_precision from "data/sssp_precision.json";

const TablePage = () => {
  const location = useLocation();

  // TODO use a service to fetch the data
  const ssspData = location.pathname.includes("efficiency")
    ? sssp_efficiency
    : sssp_precision;

  return <PTable pseudoMetadata={pseudo_metadata} ssspData={ssspData} />;
};

export default TablePage;
