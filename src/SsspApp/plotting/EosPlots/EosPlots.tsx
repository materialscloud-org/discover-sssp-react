import { useContext, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

import { LoadingSpinner, NoDataMessage } from "@sssp/components";
import { PseudosContext } from "@sssp/context";
import { EosConfigMap } from "@sssp/models";
import { SsspDataService } from "@sssp/services";

import PseudosCheckboxes from "../PseudosCheckboxes";
import EosPlot from "./EosPlot";
import EosPlotsProps from "./EosPlots.models";
import styles from "./EosPlots.module.scss";

const EosPlots: React.FC<EosPlotsProps> = ({ element }) => {
  const [loading, setLoading] = useState(true);
  const { loadingMetadata } = useContext(PseudosContext);
  const [eosConfigMap, setEosConfigMap] = useState({} as EosConfigMap);
  const [pseudos, setPseudos] = useState([] as string[]);
  const [activePseudos, setActivePseudos] = useState([] as string[]);

  useEffect(() => {
    if (!element) return;
    SsspDataService.fetchEosData()
      .then((data) => {
        const configMap = data[element];
        setEosConfigMap(configMap);
        const pseudos = Object.keys(Object.values(configMap)[0]);
        setPseudos(pseudos);
        setActivePseudos(pseudos);
      })
      .catch((error) => {
        console.error("Error fetching EOS data:", error);
        setEosConfigMap({} as EosConfigMap);
      })
      .finally(() => setLoading(false));
  }, [element]);

  return loading || loadingMetadata ? (
    <LoadingSpinner />
  ) : !eosConfigMap ? (
    <NoDataMessage />
  ) : (
    <div id="eos-plots">
      <Row>
        <Col md={4} lg={3} xxl={2} className={styles["pseudo-controls"]}>
          <PseudosCheckboxes
            pseudos={pseudos}
            activePseudos={activePseudos}
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
