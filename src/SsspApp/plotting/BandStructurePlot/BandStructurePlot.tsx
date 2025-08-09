import { BandsVisualiser } from "bands-visualiser";
import { useEffect, useRef, useState } from "react";
import { Col, FormCheck, Row } from "react-bootstrap";

import LoadingSpinner from "@sssp/components/Spinner";
import { PseudosBandsDataMap } from "@sssp/models";
import SsspDataService from "@sssp/services/data";

import { colorPalette } from "../params";
import { BandStructurePlotProps } from "./BandStructurePlot.models";
import styles from "./BandStructurePlot.module.scss";

const BandStructurePlot: React.FC<BandStructurePlotProps> = ({
  element,
  activeAccuracy,
}) => {
  const bandsPlotRef = useRef<HTMLDivElement>(null);
  const [pseudosBandsDataMap, setPseudosBandsDataMap] = useState<
    PseudosBandsDataMap | undefined
  >();
  const [loading, setLoading] = useState(true);
  const [activePseudos, setActivePseudos] = useState<string[]>(["REF"]);
  const [pseudos, setPseudos] = useState<string[]>([]);
  const [pseudoColorMap, setPseudoColorMap] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    if (!element) {
      return;
    }
    const dataService = new SsspDataService();
    dataService
      .fetchBandsData(activeAccuracy)
      .then((data) => {
        const elementData = data[element];
        setPseudosBandsDataMap(elementData);
        const pseudos = elementData && Object.keys(elementData);
        setPseudos(pseudos);
        setPseudoColorMap(
          pseudos?.reduce((acc: { [key: string]: string }, pseudo, i) => {
            acc[pseudo] = colorPalette[i % colorPalette.length];
            return acc;
          }, {})
        );
      })
      .catch((error) => {
        console.error("Error fetching bands data:", error);
        setPseudosBandsDataMap(undefined);
        setPseudos([]);
        setPseudoColorMap({});
      })
      .finally(() => {
        setLoading(false);
      });
  }, [activeAccuracy, element]);

  useEffect(() => {
    if (pseudosBandsDataMap && bandsPlotRef.current) {
      const pseudosData = activePseudos.map((pseudo) => ({
        bandsData: pseudosBandsDataMap[pseudo],
        traceFormat: {
          line: {
            color: pseudoColorMap[pseudo] || "black",
          },
        },
      }));
      BandsVisualiser(bandsPlotRef.current, {
        bandsDataArray: pseudosData,
        settings: {
          showlegend: false,
        },
      });
    }
  }, [activePseudos, pseudosBandsDataMap]);

  return loading ? (
    <LoadingSpinner />
  ) : !pseudosBandsDataMap ? (
    <div>No data available</div>
  ) : (
    <div id="bands-plots">
      <Row>
        <Col md={3} lg={2} className={styles["pseudo-controls"]}>
          <FormCheck
            type="checkbox"
            id="all"
            label="Select all"
            defaultChecked={false}
            className={styles["pseudo-checkbox"]}
            style={{ color: "black" }}
            onChange={(event) => {
              if (!event.target.checked) {
                setActivePseudos(["REF"]);
              } else {
                setActivePseudos(pseudos);
              }
            }}
          />
          {pseudos.map((pseudo) => (
            <FormCheck
              key={pseudo}
              type="checkbox"
              id={pseudo}
              label={pseudo}
              checked={activePseudos.includes(pseudo)}
              disabled={pseudo === "REF"}
              className={styles["pseudo-checkbox"]}
              style={{ color: pseudoColorMap[pseudo] }}
              onChange={(event) => {
                if (!event.target.checked) {
                  setActivePseudos(activePseudos.filter((p) => p !== pseudo));
                } else {
                  setActivePseudos([...activePseudos, pseudo]);
                }
              }}
            />
          ))}
        </Col>
        <Col>
          <div ref={bandsPlotRef} id={styles["bands-plot"]}></div>
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
