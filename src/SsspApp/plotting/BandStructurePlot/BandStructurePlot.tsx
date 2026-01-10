import { useContext, useEffect, useRef, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";

import { LoadingSpinner, NoDataMessage } from "@sssp/components";
import { PseudosContext } from "@sssp/context";
import { BandsData, BandsPseudosMap } from "@sssp/models";
import { SsspDataService } from "@sssp/services";

import PseudoSelector from "../PseudoSelector";
import BandStructurePlotProps from "./BandStructurePlot.models";
import styles from "./BandStructurePlot.module.scss";

const BandStructurePlot: React.FC<BandStructurePlotProps> = ({
  element,
  chessboardPseudos,
  bandShift,
}) => {
  const { loadingMetadata, pseudosMetadata } = useContext(PseudosContext);
  const [loadingData, setLoadingData] = useState(true);
  const [bandsPseudosMap, setBandsPseudosMap] = useState({} as BandsPseudosMap);
  const [pseudos, setPseudos] = useState([] as string[]);
  const [activePseudos, setActivePseudos] = useState(chessboardPseudos);
  const [pseudoShift, setPseudoShift] = useState(bandShift);
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!element) return;

    setLoadingData(true);
    setBandsPseudosMap({} as BandsPseudosMap);
    setPseudos([]);

    SsspDataService.fetchBandsData(element)
      .then((data) => {
        setBandsPseudosMap(data);
        const pseudos = data && Object.keys(data);
        setPseudos(pseudos);
      })
      .catch((error) => {
        console.error("Error fetching bands data:", error);
        setBandsPseudosMap({} as BandsPseudosMap);
        setPseudos([]);
      })
      .finally(() => {
        setLoadingData(false);
      });
  }, [element]);

  useEffect(() => {
    const isValidPair = (pair: string[]) =>
      pair.length === 2 && pair.every((p) => pseudos.includes(p));

    if (!pseudos.length) {
      setActivePseudos([]);
      return;
    }

    setActivePseudos((prev) => {
      if (isValidPair(chessboardPseudos)) return chessboardPseudos;
      if (isValidPair(prev)) return prev;
      return [pseudos[0], pseudos[0]];
    });
  }, [pseudos, chessboardPseudos, element]);

  useEffect(() => setPseudoShift(bandShift), [bandShift]);

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
            yaxis: {
              range: [-10, 25],
            },
          },
        });
      })();
    }
  }, [activePseudos, bandsPseudosMap, pseudosMetadata, pseudoShift]);

  const isLoading = loadingData || loadingMetadata;

  const hasData = Object.keys(bandsPseudosMap || {}).length > 0;

  return isLoading ? (
    <LoadingSpinner />
  ) : !hasData ? (
    <NoDataMessage />
  ) : (
    <Container id="bands-plots">
      <Row>
        <Col lg="3">
          <div id={styles["pseudo-selectors-form"]}>
            <Row className="gap-3">
              <Col sm="6" lg="12">
                <PseudoSelector
                  which="reference"
                  pseudos={pseudos}
                  value={activePseudos[0]}
                  onSelect={(pseudo) => {
                    setActivePseudos([pseudo, activePseudos[1]]);
                    setPseudoShift(0);
                  }}
                />
              </Col>
              <Col>
                <PseudoSelector
                  which="compared"
                  pseudos={pseudos}
                  value={activePseudos[1]}
                  onSelect={(pseudo) => {
                    setActivePseudos([activePseudos[0], pseudo]);
                    setPseudoShift(0);
                  }}
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
        <Col lg="auto" className="ms-lg-5">
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
