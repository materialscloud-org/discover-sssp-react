import { useContext } from "react";
import { Col, Row } from "react-bootstrap";

import { LoadingSpinner, NoDataMessage } from "@sssp/components";
import { ElementContext, PlotContext, PseudoContext } from "@sssp/context";

import PlotPaneHeader from "../PlotPaneHeader";
import BandsChessboardPaneProps from "./BandsChessboardPane.models";
import styles from "./BandsChessboardPane.module.scss";
import BandsChessboardPlot from "./BandsChessboardPlot";

const BandsChessboardPane: React.FC<BandsChessboardPaneProps> = ({
  onTileClick: goToBands,
}) => {
  const { element } = useContext(ElementContext);
  const { loadingMetadata } = useContext(PseudoContext);
  const {
    loadingChessboardData,
    setActiveChessboardPseudos,
    setBandShift,
    chessboardPseudos,
    etaV,
    etaV10,
    shifts,
  } = useContext(PlotContext);

  const tileClickHandler = (
    plotIndex: number,
    pseudos: string[],
    pointIndex: number[],
  ) => {
    setActiveChessboardPseudos(pseudos);
    setBandShift(shifts[plotIndex][pointIndex[0]][pointIndex[1]]);
    goToBands();
  };

  const hasData = etaV.length > 0 && etaV10.length > 0;

  return loadingMetadata || loadingChessboardData ? (
    <LoadingSpinner />
  ) : (
    <div id={styles.chessboardsPage}>
      <PlotPaneHeader title={`Band Chessboards: ${element}`} />
      {!hasData ? (
        <NoDataMessage />
      ) : (
        <Row className="justify-content-center g-0">
          <Col>
            <BandsChessboardPlot
              title="η<sub>v</sub>"
              chessboardPseudos={chessboardPseudos}
              values={etaV}
              zMax={30}
              onTileClick={tileClickHandler}
            />
          </Col>
          <Col>
            <BandsChessboardPlot
              title="η<sub>10</sub>"
              chessboardPseudos={chessboardPseudos}
              values={etaV10}
              zMax={60}
              onTileClick={tileClickHandler}
            />
          </Col>
        </Row>
      )}
    </div>
  );
};

export default BandsChessboardPane;
