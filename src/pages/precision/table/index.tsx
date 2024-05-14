import pseudo_metadata from "../../../data/metadata.json";
import sssp_precision from "../../../data/sssp_precision.json";

import PTable from "../../../components/ptable";

const TablePage = () => {
  return <PTable pseudoMetadata={pseudo_metadata} ssspData={sssp_precision} />;
};

export default TablePage;
