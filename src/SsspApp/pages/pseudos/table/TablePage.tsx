import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { ssspVersion } from "@sssp";
import { LoadingSpinner, PeriodicTable, PseudosLegend } from "@sssp/components";
import { HoverProvider, LibraryContext, PseudosContext } from "@sssp/context";
import { ElementsInfo } from "@sssp/models";
import { SsspDataService } from "@sssp/services";

import LibraryToggle from "./LibraryToggle";
import TablePageProps from "./TablePage.models";
import styles from "./TablePage.module.scss";

const TablePage: React.FC<TablePageProps> = ({ libraries }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const { loadingMetadata, pseudosMetadata } = useContext(PseudosContext);
  const { activeLibrary, setActiveLibrary } = useContext(LibraryContext);
  const [elementsInfo, setElementsInfo] = useState<ElementsInfo>({});

  useEffect(() => {
    const currentLibrary = location.pathname.split("/")[2];
    setActiveLibrary(currentLibrary);
  }, [location.pathname, setActiveLibrary]);

  useEffect(() => {
    SsspDataService.fetchElementsInfo(activeLibrary)
      .then((elementsInfo) => setElementsInfo(elementsInfo))
      .catch((error) => {
        console.error("Error fetching elements info:", error);
      })
      .finally(() => setLoading(false));
  }, [activeLibrary]);

  return loading || loadingMetadata ? (
    <LoadingSpinner />
  ) : (
    <div id="table-page">
      <div className="sssp-pseudos-header">
        SSSP {activeLibrary} (v{ssspVersion})
      </div>
      <HoverProvider>
        <PseudosLegend pseudosMetadata={pseudosMetadata} />
        <div id={styles["table-container"]}>
          <LibraryToggle libraries={libraries} />
          <PeriodicTable
            pseudosMetadata={pseudosMetadata}
            elementsInfo={elementsInfo}
          />
        </div>
      </HoverProvider>
    </div>
  );
};

export default TablePage;
