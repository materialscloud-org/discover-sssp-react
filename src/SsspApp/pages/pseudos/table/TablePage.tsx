import { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { PeriodicTable, PseudosLegend } from "@sssp/components";
import { HoverProvider, LibraryContext } from "@sssp/context";

import LibraryToggle from "./LibraryToggle";
import styles from "./TablePage.module.scss";

const TablePage: React.FC = () => {
  const location = useLocation();
  const { setActiveLibrary } = useContext(LibraryContext);

  useEffect(() => {
    const currentLibrary = location.pathname.split("/")[2];
    setActiveLibrary(currentLibrary);
  }, [location.pathname, setActiveLibrary]);

  return (
    <div id="table-page">
      <HoverProvider>
        <PseudosLegend />
        <div id={styles["table-container"]}>
          <LibraryToggle />
          <PeriodicTable />
        </div>
      </HoverProvider>
    </div>
  );
};

export default TablePage;
