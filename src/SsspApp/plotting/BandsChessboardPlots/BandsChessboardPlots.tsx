import { useContext, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

import { LoadingSpinner } from "@sssp/components";
import { PseudosContext } from "@sssp/context";

import { SsspDataService } from "@sssp/services";
import BandsChessboardPlot from "./BandsChessboardPlot";
import BandsChessboardPlotsProps from "./BandsChessboardPlots.models";
import styles from "./BandsChessboardPlots.module.scss";

const BandsChessboardPlots: React.FC<BandsChessboardPlotsProps> = ({
  element,
  setChessboardPseudos,
  setBandShift,
  onTileClick: goToTab,
}) => {
  const { loadingMetadata } = useContext(PseudosContext);
  const [loadingData, setLoadingData] = useState(true);
  const [pseudoFilenames, setPseudoFilenames] = useState([] as string[]);
  const [etaV, setEtaV] = useState([] as number[][]);
  const [etaV10, setEtaV10] = useState([] as number[][]);
  const [shifts, setShifts] = useState([] as number[][][]);

  useEffect(() => {
    if (!element) return;
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
    setBandShift(shifts[plotIndex][pointIndex[0]][pointIndex[1]]);
    goToTab("Band Structure");
  };

  return loadingMetadata || loadingData ? (
    <LoadingSpinner />
  ) : (
    <div id="chessboard-page">
      <div id={styles["chessboard-plots"]}>
        <Row className="justify-content-center g-0">
          <Col xxl="6">
            <BandsChessboardPlot
              pseudoFilenames={pseudoFilenames}
              values={etaV}
              title="v"
              colorMax={Math.max(...etaV.flat())}
              onTileClick={tileClickHandler}
            />
          </Col>
          <Col xxl="6">
            <BandsChessboardPlot
              pseudoFilenames={pseudoFilenames}
              values={etaV10}
              title="v10"
              colorMax={Math.max(...etaV10.flat())}
              onTileClick={tileClickHandler}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default BandsChessboardPlots;
