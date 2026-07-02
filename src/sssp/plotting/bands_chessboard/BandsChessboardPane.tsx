import { useContext, useMemo } from "react";

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

  const [average, maximum] = useMemo(() => {
    return [
      chessboardData?.average?.[activeChessboardDataFlavor].eta ?? [],
      chessboardData?.maximum?.[activeChessboardDataFlavor].eta ?? [],
    ];
  }, [chessboardData, activeChessboardDataFlavor]);

  const tileClickHandler = (
    plotIndex: number,
    pseudos: string[],
    pointIndex: number[],
  ) => {
    setActiveChessboardPseudos(pseudos);
    const plotKey = plotIndex === 0 ? "average" : "maximum";
    const data = chessboardData?.[plotKey]?.[activeChessboardDataFlavor];
    setBandShift(data?.shift?.[pointIndex[0]]?.[pointIndex[1]] ?? 0);
    goToBands();
  };

  const hasData = average?.length > 0 && maximum?.length > 0;

  return loadingMetadata || loadingPlotData ? (
    <LoadingSpinner />
  ) : (
    <div id={styles.chessboardsPage}>
      <PlotPaneHeader title={`Band Chessboards: ${element}`} />
      {!hasData ? (
        <NoDataMessage />
      ) : (
        <>
          <div id={styles.bandsChessboardPlotsContainer}>
            <div className={styles.dataFlavorToggle}>
              <Toggle
                name="chessboard-data"
                items={chessboardDataFlavors}
                activeItem={activeChessboardDataFlavor}
                onChange={(value) =>
                  setActiveChessboardDataFlavor(value as ChessboardDataFlavor)
                }
              />
            </div>
            <BandsChessboardPlot
              which="avg"
              chessboardPseudos={chessboardData.pseudos}
              values={average}
              zMax={60}
              onTileClick={tileClickHandler}
            />
            <BandsChessboardPlot
              which="max"
              chessboardPseudos={chessboardData.pseudos}
              values={maximum}
              zMax={60}
              onTileClick={tileClickHandler}
            />
          </div>
          <div id={styles.bandsChessboardPlotDetailsContainer}>
            <BandsChessboardPlotDetails />
          </div>
        </>
      )}
    </div>
  );
};

export default BandsChessboardPane;
