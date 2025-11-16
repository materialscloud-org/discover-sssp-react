import { useContext, useMemo } from "react";
import { Col } from "react-bootstrap";

import { LoadingSpinner } from "@sssp/components";
import { PseudosContext } from "@sssp/context";

import BandsChessboardPlot from "./BandsChessboardPlot";
import BandsChessboardPlotsProps from "./BandsChessboardPlots.models";
import styles from "./BandsChessboardPlots.module.scss";

const BandsChessboardPlots: React.FC<BandsChessboardPlotsProps> = ({
  goToBands,
}) => {
  const {
    loadingMetadata,
    allPseudos: pseudos,
    setActivePseudos,
  } = useContext(PseudosContext);

  const generateDummyData = (size: number): number[][] => {
    const data: number[][] = [];
    for (let i = 0; i < size; i++) {
      const row: number[] = [];
      for (let j = 0; j < size; j++) {
        row.push(Math.random() * 100);
      }
      data.push(row);
    }
    return data;
  };

  const eta_v = useMemo(() => generateDummyData(pseudos.length), [pseudos]);
  const eta_10 = useMemo(() => generateDummyData(pseudos.length), [pseudos]);

  const tileClickHandler = (pseudos: string[]) => {
    setActivePseudos(pseudos);
    goToBands("Band Structure");
  };

  return loadingMetadata ? (
    <LoadingSpinner />
  ) : (
    <div id="chessboard-page">
      <div style={{ fontWeight: "bold", textAlign: "center" }}>
        Disclaimer: The data shown does not reflect real data and is for
        demonstration purposes only.
      </div>
      <div id={styles["chessboard-plots"]}>
        <Col xl={12} xxl={6}>
          <BandsChessboardPlot
            pseudos={pseudos}
            values={eta_v}
            title="V"
            colorMax={Math.max(...eta_v.flat())}
            tileClickHandler={tileClickHandler}
          />
        </Col>
        <Col xl={12} xxl={6}>
          <BandsChessboardPlot
            pseudos={pseudos}
            values={eta_10}
            title="10"
            colorMax={Math.max(...eta_10.flat())}
            tileClickHandler={tileClickHandler}
          />
        </Col>
      </div>
    </div>
  );
};

export default BandsChessboardPlots;
