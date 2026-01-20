import { useContext } from "react";
import { Col, Row } from "react-bootstrap";

import { LoadingSpinner } from "@sssp/components";
import { PlotContext, PseudoContext } from "@sssp/context";

import BandsChessboardPaneProps from "./BandsChessboardPane.models";
import styles from "./BandsChessboardPane.module.scss";
import BandsChessboardPlot from "./BandsChessboardPlot";

const BandsChessboardPane: React.FC<BandsChessboardPaneProps> = ({
  onTileClick: goToBands,
}) => {
  const { loadingMetadata } = useContext(PseudoContext);
  const {
    loadingChessboardData,
    setChessboardPseudos,
    setBandShift,
    pseudoFilenames,
    etaV,
    etaV10,
    shifts,
  } = useContext(PlotContext);

  const tileClickHandler = (
    plotIndex: number,
    pseudos: string[],
    pointIndex: number[],
  ) => {
    setChessboardPseudos(pseudos);
    setBandShift(shifts[plotIndex][pointIndex[0]][pointIndex[1]]);
    goToBands();
  };

  return loadingMetadata || loadingChessboardData ? (
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
