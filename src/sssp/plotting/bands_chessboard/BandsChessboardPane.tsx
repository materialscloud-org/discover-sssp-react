import { useContext, useMemo } from "react";
import { Col, Row } from "react-bootstrap";

import { LoadingSpinner, NoDataMessage } from "@sssp/components";
import { ElementContext, PlotContext, PseudoContext } from "@sssp/context";

import Toggle from "@sssp/components/Toggle";
import { ChessboardDataFlavor } from "@sssp/models";
import PlotPaneHeader from "../PlotPaneHeader";
import BandsChessboardPaneProps from "./BandsChessboardPane.models";
import styles from "./BandsChessboardPane.module.scss";
import BandsChessboardPlot from "./BandsChessboardPlot";
import BandsChessboardPlotDetails from "./BandsChessboardPlotDetails";

const BandsChessboardPane: React.FC<BandsChessboardPaneProps> = ({
  onTileClick: goToBands,
}) => {
  const { element } = useContext(ElementContext);
  const { loadingMetadata } = useContext(PseudoContext);
  const {
    loadingPlotData,
    setActiveChessboardPseudos,
    setBandShift,
    chessboardData,
    chessboardDataFlavors,
    activeChessboardDataFlavor,
    setActiveChessboardDataFlavor,
  } = useContext(PlotContext);

  const etaV = useMemo(
    () => chessboardData.v_distance[activeChessboardDataFlavor].eta,
    [chessboardData, activeChessboardDataFlavor],
  );
  const etaV10 = useMemo(
    () => chessboardData.v10_distance[activeChessboardDataFlavor].eta,
    [chessboardData, activeChessboardDataFlavor],
  );

  const tileClickHandler = (
    plotIndex: number,
    pseudos: string[],
    pointIndex: number[],
  ) => {
    setActiveChessboardPseudos(pseudos);
    const plotKey = plotIndex === 0 ? "v_distance" : "v10_distance";
    const data = chessboardData[plotKey][activeChessboardDataFlavor];
    setBandShift(data.shift[pointIndex[0]][pointIndex[1]]);
    goToBands();
  };

  const hasData = etaV.length > 0 && etaV10.length > 0;

  return loadingMetadata || loadingPlotData ? (
    <LoadingSpinner />
  ) : (
    <div id={styles.chessboardsPage}>
      <PlotPaneHeader title={`Band Chessboards: ${element}`} />
      {!hasData ? (
        <NoDataMessage />
      ) : (
        <>
          <Toggle
            name="chessboard-data"
            items={chessboardDataFlavors}
            activeItem={activeChessboardDataFlavor}
            onChange={(value) =>
              setActiveChessboardDataFlavor(value as ChessboardDataFlavor)
            }
          />
          <Row className="justify-content-center g-0">
            <Col>
              <BandsChessboardPlot
                title="η<sub>v</sub>"
                chessboardPseudos={chessboardData.pseudos}
                values={etaV}
                zMax={30}
                onTileClick={tileClickHandler}
              />
            </Col>
            <Col>
              <BandsChessboardPlot
                title="η<sub>10</sub>"
                chessboardPseudos={chessboardData.pseudos}
                values={etaV10}
                zMax={60}
                onTileClick={tileClickHandler}
              />
            </Col>
          </Row>
          <div id={styles.bandsChessboardPlotDetailsContainer}>
            <BandsChessboardPlotDetails />
          </div>
        </>
      )}
    </div>
  );
};

export default BandsChessboardPane;
