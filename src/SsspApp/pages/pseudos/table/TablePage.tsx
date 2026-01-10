import { useContext, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
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
    <HoverProvider>
      <div id={styles["table-page"]}>
        <Row>
          <Col xxl="auto">
            <PseudosLegend />
          </Col>
          <Col>
            <div id={styles["table-container"]}>
              <LibraryToggle />
              <PeriodicTable />
            </div>
          </Col>
        </Row>
      </div>
    </HoverProvider>
  );
};

export default TablePage;
