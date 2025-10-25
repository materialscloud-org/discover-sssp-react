import { useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";

import { BandsVisualiser } from "bands-visualiser";

import { LoadingSpinner } from "@sssp/components";
import { PseudosBandsDataMap } from "@sssp/models";
import { SsspDataService } from "@sssp/services";

import { colorPalette } from "../params";
import PseudosCheckboxes from "../PseudosCheckboxes";
import BandStructurePlotProps from "./BandStructurePlot.models";
import styles from "./BandStructurePlot.module.scss";

const BandStructurePlot: React.FC<BandStructurePlotProps> = ({
  element,
  activeLibrary,
}) => {
  const bandsPlotRef = useRef<HTMLDivElement>(null);
  const [pseudosBandsDataMap, setPseudosBandsDataMap] = useState<
    PseudosBandsDataMap | undefined
  >();
  const [loading, setLoading] = useState(true);
  const [pseudos, setPseudos] = useState<string[]>([]);
  const [activePseudos, setActivePseudos] = useState<string[]>(["REF"]);
  const [pseudosColormap, setPseudosColormap] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    if (!element) {
      return;
    }
    const dataService = new SsspDataService();
    dataService
      .fetchBandsData(activeLibrary)
      .then((data) => {
        const elementData = data[element];
        setPseudosBandsDataMap(elementData);
        const pseudos = elementData && Object.keys(elementData);
        setPseudos(pseudos);
        setPseudosColormap(
          pseudos?.reduce((lib: { [key: string]: string }, pseudo, i) => {
            lib[pseudo] = colorPalette[i % colorPalette.length];
            return lib;
          }, {})
        );
      })
      .catch((error) => {
        console.error("Error fetching bands data:", error);
        setPseudosBandsDataMap(undefined);
        setPseudos([]);
        setPseudosColormap({});
      })
      .finally(() => {
        setLoading(false);
      });
  }, [activeLibrary, element]);

  useEffect(() => {
    if (pseudosBandsDataMap && bandsPlotRef.current) {
      const pseudosData = activePseudos.map((pseudo) => ({
        bandsData: pseudosBandsDataMap[pseudo],
        traceFormat: {
          line: {
            color: pseudosColormap[pseudo] || "black",
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
    <span>No data available</span>
  ) : (
    <div id="bands-plots">
      <Row>
        <Col md={3} lg={2}>
          <PseudosCheckboxes
            pseudos={pseudos}
            activePseudos={activePseudos}
            pseudosColormap={pseudosColormap}
            setActivePseudos={setActivePseudos}
          />
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
