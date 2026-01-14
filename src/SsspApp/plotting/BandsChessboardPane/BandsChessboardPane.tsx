import { useContext, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

import { LoadingSpinner } from "@sssp/components";
import { PlottingContext, PseudosContext } from "@sssp/context";

import { SsspDataService } from "@sssp/services";
import BandsChessboardPaneProps from "./BandsChessboardPane.models";
import styles from "./BandsChessboardPane.module.scss";
import BandsChessboardPlot from "./BandsChessboardPlot";

const BandsChessboardPane: React.FC<BandsChessboardPaneProps> = ({
  element,
  onTileClick: goToBands,
}) => {
  const { loadingMetadata } = useContext(PseudosContext);
  const { setChessboardPseudos, setChessboardBandShift } =
    useContext(PlottingContext);
  const [loadingData, setLoadingData] = useState(true);
  const [pseudoFilenames, setPseudoFilenames] = useState([] as string[]);
  const [etaV, setEtaV] = useState([] as number[][]);
  const [etaV10, setEtaV10] = useState([] as number[][]);
  const [shifts, setShifts] = useState([] as number[][][]);

  useEffect(() => {
    if (!element) return;

    setLoadingData(true);
    setPseudoFilenames([]);
    setEtaV([]);
    setEtaV10([]);
    setShifts([]);

    SsspDataService.fetchBandChessboardData(element)
      .then((data) => {
        setPseudoFilenames(data.pseudos);
        setEtaV(data.v_distance.max_diff_c);
        setEtaV10(data.v10_distance.max_diff_c);
        const bandShifts = [data.v_distance.shift_c, data.v10_distance.shift_c];
        setShifts(bandShifts);
      })
      .catch((error) => {
        console.error("Error fetching band chessboard data:", error);
        setPseudoFilenames([]);
        setEtaV([]);
        setEtaV10([]);
        setShifts([]);
      })
      .finally(() => {
        setLoadingData(false);
      });
  }, [element]);

  const tileClickHandler = (
    plotIndex: number,
    pseudos: string[],
    pointIndex: number[]
  ) => {
    setChessboardPseudos(pseudos);
    setChessboardBandShift(shifts[plotIndex][pointIndex[0]][pointIndex[1]]);
    goToBands();
  };

  return loadingMetadata || loadingData ? (
    <LoadingSpinner />
  ) : (
    <div id="chessboard-page">
      <div id={styles["chessboard-plots"]}>
        <Row className="justify-content-center g-0">
          <Col>
            <BandsChessboardPlot
              title="η<sub>v</sub>"
              pseudoFilenames={pseudoFilenames}
              values={etaV}
              zMax={30}
              onTileClick={tileClickHandler}
            />
          </Col>
          <Col>
            <BandsChessboardPlot
              title="η10"
              pseudoFilenames={pseudoFilenames}
              values={etaV10}
              zMax={60}
              onTileClick={tileClickHandler}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default BandsChessboardPane;
