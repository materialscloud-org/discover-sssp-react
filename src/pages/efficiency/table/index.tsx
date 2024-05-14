import pseudo_metadata from "../../../data/metadata.json";
import sssp_efficiency from "../../../data/sssp_efficiency.json";

import PTable from "../../../components/ptable";

const TablePage = () => {
  return <PTable pseudoMetadata={pseudo_metadata} ssspData={sssp_efficiency} />;
};

export default TablePage;
