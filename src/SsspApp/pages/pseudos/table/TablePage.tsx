import { useContext, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";

import { ssspVersion } from "@sssp";
import { capitalize } from "@sssp/common/utils";
import { PeriodicTable, PseudosLegend } from "@sssp/components";
import { FamilyContext, HoverProvider } from "@sssp/context";

import LibraryToggle from "./LibraryToggle";
import styles from "./TablePage.module.scss";

const TablePage: React.FC = () => {
  const location = useLocation();
  const { activeLibrary, setActiveLibrary, activeFunctional } =
    useContext(FamilyContext);

  useEffect(() => {
    const currentLibrary = location.pathname.split("/")[2];
    setActiveLibrary(currentLibrary);
  }, [location.pathname, setActiveLibrary]);

  return (
    <div id={styles.tablePage}>
      <header className="page-title">
        <h1 className="display-6">
          SSSP {activeFunctional} {capitalize(activeLibrary)} v{ssspVersion}
        </h1>
      </header>
      <HoverProvider>
        <Row className="g-3">
          <Col xxl="auto" className="mx-auto">
            <PseudosLegend />
          </Col>
          <Col>
            <div id={styles.tableContainer}>
              <LibraryToggle />
              <PeriodicTable />
            </div>
          </Col>
        </Row>
      </HoverProvider>
    </div>
  );
};

export default TablePage;
