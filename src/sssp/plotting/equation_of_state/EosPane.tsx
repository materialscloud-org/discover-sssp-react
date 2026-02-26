import { useContext, useMemo } from "react";
import { Col, Row } from "react-bootstrap";

import { LoadingSpinner, NoDataMessage } from "@sssp/components";
import { ElementContext, PlotContext, PseudoContext } from "@sssp/context";
import { EosPlotData } from "@sssp/models";

import PlotPaneHeader from "../PlotPaneHeader";
import styles from "./EosPane.module.scss";
import EosPlot from "./EosPlot";
import EosTable from "./EosTable";
import PseudosCheckboxes from "./PseudosCheckboxes";

const EosPane: React.FC = () => {
  const { element } = useContext(ElementContext);
  const { loadingMetadata } = useContext(PseudoContext);
  const {
    loadingPlotData,
    eosPseudosMap,
    eosPseudos,
    activeEosPseudos,
    setActiveEosPseudos,
  } = useContext(PlotContext);

  const eosConfigPseudoMap = useMemo(() => {
    const map: { [configuration: string]: { [pseudo: string]: EosPlotData } } =
      {};
    Object.entries(eosPseudosMap).forEach(([pseudo, pseudoData]) => {
      Object.entries(pseudoData.configurations).forEach(([conf, eosData]) => {
        const configuration = conf.includes("X")
          ? conf.replace("X", element)
          : `${element}-${conf === "DC" ? "Diamond" : conf}`;
        if (!map[configuration]) {
          map[configuration] = {};
        }
        map[configuration][pseudo] = eosData;
      });
    });
    return map;
  }, [element, eosPseudosMap]);

  const isLoading = loadingPlotData || loadingMetadata;

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <div id={styles.eosPane}>
      <PlotPaneHeader title={`Equation of State: ${element}`} />
      {!eosPseudos.length ? (
        <NoDataMessage />
      ) : (
        <div id={styles.eosContent}>
          <div id={styles.eosPlots}>
            <Row>
              <Col md={4} lg={3} id={styles.sidebar}>
                <PseudosCheckboxes
                  pseudos={eosPseudos}
                  activePseudos={activeEosPseudos}
                  setActivePseudos={setActiveEosPseudos}
                />
              </Col>
              <Col>
                <Row>
                  {Object.entries(eosConfigPseudoMap).map(
                    ([configuration, eosPseudosMap]) => {
                      return (
                        <Col lg={6} xl={4} key={configuration}>
                          <EosPlot
                            configuration={configuration}
                            eosPseudosMap={eosPseudosMap}
                            activePseudos={activeEosPseudos}
                          />
                        </Col>
                      );
                    },
                  )}
                </Row>
                <div id={styles.eosNote}>
                  Comparison of equations of state for different
                  pseudopotentials and their Birch-Murnaghan fits.
                  <br />
                  "REF (AE average)" refers to the all-electron average values
                  from the reference dataset published in{" "}
                  <a
                    href="https://www.nature.com/articles/s42254-023-00655-3"
                    target="_blank"
                  >
                    Bosoni et al., <em>Nature Reviews Physics</em> <b>6</b>,
                    45-58 (2024)
                  </a>
                </div>
              </Col>
            </Row>
          </div>
          <hr />
          <EosTable eosPseudosMap={eosPseudosMap} />
        </div>
      )}
    </div>
  );
};

export default EosPane;
