import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";

import { LoadingSpinner, NoDataMessage } from "@sssp/components";
import { PseudosContext } from "@sssp/context";
import { BandsData, BandsPseudosMap } from "@sssp/models";
import { SsspDataService } from "@sssp/services";

import PseudoSelector from "../PseudoSelector";
import BandStructurePlotProps from "./BandStructurePlot.models";
import styles from "./BandStructurePlot.module.scss";

const BandStructurePlot: React.FC<BandStructurePlotProps> = ({ element }) => {
  const [loadingData, setLoadingData] = useState(true);
  const {
    loadingMetadata,
    categorizedPseudosMetadata,
    activePseudos,
    setActivePseudos,
  } = useContext(PseudosContext);
  const [pseudos, setPseudos] = useState<string[]>([]);
  const [bandsPseudosMap, setBandsPseudosMap] = useState<BandsPseudosMap>();
  const [pseudoShift, setPseudoShift] = useState(0);
  const plotRef = useRef<HTMLDivElement>(null);

  const pseudosMetadata = useMemo(
    () => Object.assign({}, ...Object.values(categorizedPseudosMetadata)),
    []
  );

  useEffect(() => {
    if (!element) return;
    SsspDataService.fetchBandsData()
      .then((data) => {
        const elementBandsData = data[element];
        setBandsPseudosMap(elementBandsData);
        const pseudos = elementBandsData && Object.keys(elementBandsData);
        setPseudos(pseudos);
        const defaultPseudo = pseudos ? pseudos[0] : "";
        setActivePseudos(
          activePseudos.length ? activePseudos : [defaultPseudo, defaultPseudo]
        );
      })
      .catch((error) => {
        console.error("Error fetching bands data:", error);
        setBandsPseudosMap(undefined);
        setPseudos([]);
        setActivePseudos([]);
      })
      .finally(() => {
        setLoadingData(false);
      });
  }, [element]);

  useEffect(() => setPseudoShift(0), [activePseudos]);

  useEffect(() => {
    if (bandsPseudosMap && plotRef.current) {
      const pseudosData = activePseudos.map((pseudo, index) => ({
        bandsData:
          index == 0
            ? bandsPseudosMap[pseudo]
            : shiftBandsData(bandsPseudosMap[pseudo], pseudoShift),
        traceFormat: {
          line: {
            color:
              index == 0 ? "black" : pseudosMetadata[pseudo]?.color || "red",
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
  }, [activePseudos, bandsPseudosMap, pseudosMetadata, pseudoShift]);

  const isLoading = loadingData || loadingMetadata;

  return isLoading ? (
    <LoadingSpinner />
  ) : !bandsPseudosMap ? (
    <NoDataMessage />
  ) : (
    <Container id="bands-plots">
      <div
        style={{
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "1rem",
        }}
      >
        Disclaimer: The data shown does not reflect real data and is for
        demonstration purposes only.
      </div>
      <Row>
        <Col lg="3">
          <div id={styles["pseudo-selectors-form"]}>
            <Row>
              <Col sm="6" lg="12">
                <PseudoSelector
                  which="reference"
                  pseudos={pseudos}
                  value={activePseudos[0]}
                  onSelect={(pseudo) =>
                    setActivePseudos([pseudo, activePseudos[1]])
                  }
                />
              </Col>
              <Col>
                <PseudoSelector
                  which="compared"
                  pseudos={pseudos}
                  value={activePseudos[1]}
                  onSelect={(pseudo) =>
                    setActivePseudos([activePseudos[0], pseudo])
                  }
                />
              </Col>
            </Row>
            <Form.Group>
              <Form.Label htmlFor="pseudo-shift-range">
                Avg. band difference (eV):
              </Form.Label>
              <Row style={{ alignItems: "center" }}>
                <Col xs="8" sm="9" md="10" lg="6" xl="7" xxl="8">
                  <Form.Range
                    id={styles["pseudo-shift-range"]}
                    value={pseudoShift}
                    min={-5}
                    max={5}
                    step={0.001}
                    onChange={(e) => setPseudoShift(Number(e.target.value))}
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="number"
                    value={pseudoShift}
                    min={-5}
                    max={5}
                    step={0.001}
                    onChange={(e) => setPseudoShift(Number(e.target.value))}
                  />
                </Col>
              </Row>
            </Form.Group>
          </div>
        </Col>
        <Col lg="6">
          <div id={styles["bands-plot-wrapper"]}>
            <div ref={plotRef} id={styles["bands-plot"]}></div>
          </div>
        </Col>
      </Row>
      <div id={styles["bands-note"]}>
        Electronic band structure along high-symmetry path. The reference energy
        (0 eV) corresponds to the Fermi level.
      </div>
    </Container>
  );
};

export default BandStructurePlot;

function shiftBandsData(bandsData: BandsData, shift: number): BandsData {
  return {
    ...bandsData,
    paths: bandsData.paths.map((path) => ({
      ...path,
      values: path.values.map((point) => point.map((p) => p + shift)),
    })),
  };
}
