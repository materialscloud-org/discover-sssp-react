import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";

import { LoadingSpinner, NoDataMessage } from "@sssp/components";
import { PseudosContext } from "@sssp/context";
import { BandsPseudosMap } from "@sssp/models";
import { SsspDataService } from "@sssp/services";

import PseudosCheckboxes from "../PseudosCheckboxes";
import BandStructurePlotProps from "./BandStructurePlot.models";
import styles from "./BandStructurePlot.module.scss";

const BandStructurePlot: React.FC<BandStructurePlotProps> = ({ element }) => {
  const [loading, setLoading] = useState(true);
  const {
    loadingMetadata,
    categorizedPseudosMetadata,
    activePseudos,
    setActivePseudos,
  } = useContext(PseudosContext);
  const [pseudos, setPseudos] = useState<string[]>([]);
  const [bandsPseudosMap, setBandsPseudosMap] = useState<BandsPseudosMap>();
  const plotRef = useRef<HTMLDivElement>(null);

  const pseudosMetadata = useMemo(
    () => Object.assign({}, ...Object.values(categorizedPseudosMetadata)),
    []
  );

  useEffect(() => {
    if (!element) return;
    SsspDataService.fetchBandsData()
      .then((data) => {
        const elementData = data[element];
        setBandsPseudosMap(elementData);
        const pseudos = elementData && Object.keys(elementData);
        setPseudos(pseudos);
        setActivePseudos(["REF"]);
      })
      .catch((error) => {
        console.error("Error fetching bands data:", error);
        setBandsPseudosMap(undefined);
        setPseudos([]);
        setActivePseudos([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [element]);

  useEffect(() => {
    if (bandsPseudosMap && plotRef.current) {
      const pseudosData = activePseudos.map((pseudo) => ({
        bandsData: bandsPseudosMap[pseudo],
        traceFormat: {
          line: {
            color: pseudosMetadata[pseudo]?.color || "black",
          },
        },
      }));

      let BandsVisualiser: any | null = null;

      (async () => {
        BandsVisualiser = (await import("bands-visualiser")).BandsVisualiser;

        BandsVisualiser(plotRef.current, {
          bandsDataArray: pseudosData,
          settings: {
            showlegend: false,
          },
        });
      })();
    }
  }, [activePseudos, bandsPseudosMap, pseudosMetadata]);

  return loading || loadingMetadata ? (
    <LoadingSpinner />
  ) : !bandsPseudosMap ? (
    <NoDataMessage />
  ) : (
    <div id="bands-plots">
      <div style={{ fontWeight: "bold", textAlign: "center" }}>
        Disclaimer: The data shown does not reflect real data and is for
        demonstration purposes only.
      </div>
      <Row>
        <Col md={3} lg={2}>
          <PseudosCheckboxes
            pseudos={pseudos}
            activePseudos={activePseudos}
            setActivePseudos={setActivePseudos}
          />
        </Col>
        <Col>
          <div ref={plotRef} id={styles["bands-plot"]}></div>
        </Col>
      </Row>
      <div id={styles["bands-note"]}>
        Electronic band structure along high-symmetry path. The reference energy
        (0 eV) corresponds to the Fermi level.
      </div>
    </div>
  );
};

export default BandStructurePlot;
