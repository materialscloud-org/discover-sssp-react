import { useContext, useEffect, useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

import { ssspVersion } from "@sssp";
import { capitalize } from "@sssp/common/utils";
import { PeriodicTable, PseudosLegend } from "@sssp/components";
import { HoverProvider, LibraryContext } from "@sssp/context";
import { ElementsInfo, PseudosMetadata } from "@sssp/models";
import { SsspDataService } from "@sssp/services";

import TablePageProps from "./TablePage.models";
import styles from "./TablePage.module.scss";

const TablePage: React.FC<TablePageProps> = ({ libraries }) => {
  const location = useLocation();
  const { activeLibrary, setActiveLibrary } = useContext(LibraryContext);
  const [elementsInfo, setElementsInfo] = useState<ElementsInfo>({});
  const [pseudosMetadata, setPseudosMetadata] = useState<PseudosMetadata>({});

  useEffect(() => {
    const currentLibrary = location.pathname.split("/")[2];
    setActiveLibrary(currentLibrary);
  }, [location.pathname, setActiveLibrary]);

  useEffect(() => {
    const dataService = new SsspDataService();
    dataService
      .fetchPseudosMetadata()
      .then((metadata) => setPseudosMetadata(metadata))
      .catch((error) => {
        console.error("Error fetching pseudos metadata:", error);
      });
  }, []);

  useEffect(() => {
    const dataService = new SsspDataService();
    dataService
      .fetchElementsInfo(activeLibrary)
      .then((elementsInfo) => setElementsInfo(elementsInfo))
      .catch((error) => {
        console.error("Error fetching elements info:", error);
      });
  }, [activeLibrary]);

  return (
    <div id="table-page">
      <div className="sssp-pseudos-header">
        SSSP {activeLibrary} (v{ssspVersion})
      </div>
      <HoverProvider>
        <PseudosLegend pseudosMetadata={pseudosMetadata} />
        <LibraryToggle libraries={libraries} />
        <PeriodicTable
          pseudosMetadata={pseudosMetadata}
          elementsInfo={elementsInfo}
        />
      </HoverProvider>
    </div>
  );
};

const LibraryToggle: React.FC<TablePageProps> = ({ libraries: libraries }) => {
  const navigate = useNavigate();
  const { activeLibrary } = useContext(LibraryContext);
  return (
    <ToggleButtonGroup
      id={styles["library-controls"]}
      type="radio"
      name="library"
      value={activeLibrary}
      onChange={(value) => navigate(`../${value}`)}
    >
      {libraries.map((library) => (
        <ToggleButton key={library} id={library} value={library}>
          {capitalize(library)}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default TablePage;
