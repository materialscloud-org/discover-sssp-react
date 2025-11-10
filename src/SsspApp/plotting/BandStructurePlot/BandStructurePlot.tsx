import { useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";

import { LoadingSpinner } from "@sssp/components";
import { BandsPseudosMap, PseudosColormap } from "@sssp/models";
import { SsspDataService } from "@sssp/services";

import { colorPalette } from "../params";
import PseudosCheckboxes from "../PseudosCheckboxes";
import BandStructurePlotProps from "./BandStructurePlot.models";
import styles from "./BandStructurePlot.module.scss";

const BandStructurePlot: React.FC<BandStructurePlotProps> = ({
  element,
  activeLibrary,
  activePseudos,
  setActivePseudos,
}) => {
  const [loading, setLoading] = useState(true);
  const [pseudos, setPseudos] = useState<string[]>([]);
  const [bandsPseudosMap, setBandsPseudosMap] = useState<BandsPseudosMap>();
  const [pseudosColormap, setPseudosColormap] = useState<PseudosColormap>({});
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!element) {
      return;
    }
    SsspDataService.fetchBandsData(activeLibrary)
      .then((data) => {
        const elementData = data[element];
        setBandsPseudosMap(elementData);
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
        setBandsPseudosMap(undefined);
        setPseudos([]);
        setPseudosColormap({});
      })
      .finally(() => {
        setLoading(false);
      });
  }, [activeLibrary, element]);

  useEffect(() => {
    if (bandsPseudosMap && plotRef.current) {
      const pseudosData = activePseudos.map((pseudo) => ({
        bandsData: bandsPseudosMap[pseudo],
        traceFormat: {
          line: {
            color: pseudosColormap[pseudo] || "black",
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
  }, [activePseudos, bandsPseudosMap]);

  return loading ? (
    <LoadingSpinner />
  ) : !bandsPseudosMap ? (
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
