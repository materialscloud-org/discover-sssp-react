import { useEffect, useState } from "react";
import {
  Button,
  FormSelect,
  OverlayTrigger,
  Tab,
  Tabs,
  Tooltip,
} from "react-bootstrap";
import { OverlayInjectedProps } from "react-bootstrap/esm/Overlay";
import { BiInfoCircle } from "react-icons/bi";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { capitalize } from "@sssp/common/utils";
import { LoadingSpinner } from "@sssp/components";
import { ElementDataResponse } from "@sssp/models";
import { InvalidPage } from "@sssp/pages";
import { PlotFactory } from "@sssp/plotting";
import { SsspDataService } from "@sssp/services";

import DetailsPageProps from "./DetailsPage.models";
import styles from "./DetailsPage.module.scss";

const TYPES = [
  "Overview",
  "Bands Chessboards",
  "Equation of State",
  "Band Structure",
  // "More",
];

const DetailsPage: React.FC<DetailsPageProps> = ({ libraries }) => {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const hashLibrary = location?.hash.substring(1) || "";
  const [activeLibrary, setActiveLibrary] = useState(hashLibrary);
  const [activeTab, setActiveTab] = useState("Overview");
  const [elementData, setElementData] = useState<ElementDataResponse>();
  const [loading, setLoading] = useState(true);
  const { element } = params;

  useEffect(() => {
    const hashLibrary = location?.hash.substring(1);
    setActiveLibrary(hashLibrary || "");
  }, [location]);

  useEffect(() => {
    if (!element) {
      return;
    }
    const dataService = new SsspDataService();
    dataService
      .fetchElementData(element)
      .then((data) => setElementData(data))
      .catch((error) => {
        setElementData(undefined);
        console.error("Error fetching element data", error);
      })
      .finally(() => setLoading(false));
  }, [activeLibrary, element]);

  return loading ? (
    <LoadingSpinner />
  ) : (activeLibrary && !libraries.includes(activeLibrary)) || !elementData ? (
    <InvalidPage />
  ) : (
    <div id="details-page">
      <div id={styles["details-controls"]}>
        <Button
          id={styles["back-button"]}
          onClick={() => navigate(`/pseudopotentials/${activeLibrary}`)}
        >
          Back to table
        </Button>
        <FormSelect
          id={styles["library-selector"]}
          value={activeLibrary}
          onChange={(event) => navigate(`#${event.target.value}`)}
        >
          <option value="" disabled>
            Choose library
          </option>
          {libraries.map((library) => (
            <option key={library} value={library}>
              {capitalize(library)}
            </option>
          ))}
        </FormSelect>
        <LibraryInfo />
      </div>
      <div className="sssp-pseudos-header">
        <span>Element: {`${element || "None provided"}`}</span>
      </div>
      {element && (
        <Tabs
          id="sssp-pseudos-tabs"
          defaultActiveKey="Overview"
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k || "Overview")}
        >
          {TYPES.map((type: string) => (
            <Tab key={type} eventKey={type} title={type}>
              <PlotFactory
                element={element}
                elementData={elementData}
                activeLibrary={activeLibrary}
                type={type}
              />
            </Tab>
          ))}
        </Tabs>
      )}
    </div>
  );
};

const LibraryInfo = () => {
  const showTooltip = (props: OverlayInjectedProps) => (
    <Tooltip id={styles["library-tooltip"]} {...props}>
      The recommended pseudopotential for the selected library will be
      highlighted in the data below
    </Tooltip>
  );

  return (
    <div id={styles["library-info"]}>
      <OverlayTrigger
        placement="right"
        delay={{ show: 100, hide: 100 }}
        overlay={showTooltip}
      >
        <span>
          <BiInfoCircle style={{ cursor: "pointer" }} />
        </span>
      </OverlayTrigger>
    </div>
  );
};

export default DetailsPage;
