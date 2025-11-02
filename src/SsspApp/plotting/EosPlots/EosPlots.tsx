import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

import { LoadingSpinner } from "@sssp/components";
import { EosConfigMap, PseudosColormap } from "@sssp/models";
import { SsspDataService } from "@sssp/services";

import { colorPalette } from "../params";
import PseudosCheckboxes from "../PseudosCheckboxes";
import EosPlot from "./EosPlot";
import EosPlotsProps from "./EosPlots.models";
import styles from "./EosPlots.module.scss";

const EosPlots: React.FC<EosPlotsProps> = ({ element, activeLibrary }) => {
  const [loading, setLoading] = useState(true);
  const [eosConfigMap, setEosConfigMap] = useState<EosConfigMap>();
  const [pseudos, setPseudos] = useState<string[]>([]);
  const [activePseudos, setActivePseudos] = useState<string[]>([]);
  const [pseudosColormap, setPseudosColormap] = useState<PseudosColormap>({});

  useEffect(() => {
    if (!element) return;
    const dataService = new SsspDataService();
    dataService
      .fetchEosData(activeLibrary)
      .then((data) => {
        const configMap = data[element];
        setEosConfigMap(configMap);
        const pseudos = Object.keys(Object.values(configMap)[0]);
        setPseudos(pseudos);
        setActivePseudos(pseudos);
        setPseudosColormap(
          pseudos.reduce((colormap: PseudosColormap, pseudo, i) => {
            colormap[pseudo] = colorPalette[i % colorPalette.length];
            return colormap;
          }, {} as PseudosColormap)
        );
      })
      .catch((error) => {
        console.error("Error fetching EOS data:", error);
        setEosConfigMap(undefined);
      })
      .finally(() => setLoading(false));
  }, [activeLibrary, element]);

  return loading ? (
    <LoadingSpinner />
  ) : !eosConfigMap ? (
    <span>No data available</span>
  ) : (
    <div id="eos-plots">
      <Row>
        <Col md={4} lg={3} xxl={2} className={styles["pseudo-controls"]}>
          <PseudosCheckboxes
            pseudos={pseudos}
            activePseudos={activePseudos}
            pseudosColormap={pseudosColormap}
            setActivePseudos={setActivePseudos}
          />
        </Col>
        <Col>
          <Row>
            {Object.entries(eosConfigMap).map(
              ([configuration, eosPseudosMap]) => (
                <Col lg={6} xl={4} xxl={3} key={configuration}>
                  <EosPlot
                    configuration={configuration}
                    eosPseudosMap={eosPseudosMap}
                    pseudosColormap={pseudosColormap}
                    activePseudos={activePseudos}
                  />
                </Col>
              )
            )}
          </Row>
        </Col>
      </Row>
      <div id={styles["eos-note"]}>
        Comparison of the Birch-Murnaghan fit of the pseudopotential equation of
        state ("Fit") with the reference all-electron results ("Wien2k").
      </div>
    </div>
  );
};

export default EosPlots;
