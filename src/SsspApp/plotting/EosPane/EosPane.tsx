import { useContext, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

import { LoadingSpinner, NoDataMessage } from "@sssp/components";
import { PlottingContext, PseudosContext } from "@sssp/context";
import { EosConfigMap } from "@sssp/models";
import { SsspDataService } from "@sssp/services";

import EosPaneProps from "./EosPane.models";
import styles from "./EosPane.module.scss";
import EosPlot from "./EosPlot";
import EosTable from "./EosTable";
import PseudosCheckboxes from "./PseudosCheckboxes";

const EosPane: React.FC<EosPaneProps> = ({ element }) => {
  const { loadingMetadata } = useContext(PseudosContext);
  const { loadingConvergenceData, summaryData } = useContext(PlottingContext);
  const [loadingData, setLoadingData] = useState(true);
  const [eosConfigMap, setEosConfigMap] = useState({} as EosConfigMap);
  const [pseudos, setPseudos] = useState([] as string[]);
  const [activePseudos, setActivePseudos] = useState([] as string[]);

  useEffect(() => {
    if (!element) return;

    setLoadingData(true);
    setEosConfigMap({} as EosConfigMap);
    setPseudos([]);
    setActivePseudos([]);

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
        setPseudos([]);
        setActivePseudos([]);
      })
      .finally(() => setLoadingData(false));
  }, [element]);

  const isLoading = loadingData || loadingMetadata || loadingConvergenceData;

  return isLoading ? (
    <LoadingSpinner />
  ) : !pseudos.length ? (
    <NoDataMessage />
  ) : (
    <div id="eos-pane">
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
          Comparison of the Birch-Murnaghan fit of the pseudopotential equation
          of state ("Fit") with the reference all-electron results ("Wien2k").
        </div>
      </div>
      <hr />
      <EosTable eosConfigMap={eosConfigMap} summaryData={summaryData} />
    </div>
  );
};

export default EosPane;
