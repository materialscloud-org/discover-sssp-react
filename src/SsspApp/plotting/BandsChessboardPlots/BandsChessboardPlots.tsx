import { useContext, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

import { LoadingSpinner } from "@sssp/components";
import { PseudosContext } from "@sssp/context";

import { SsspDataService } from "@sssp/services";
import BandsChessboardPlot from "./BandsChessboardPlot";
import BandsChessboardPlotsProps from "./BandsChessboardPlots.models";
import styles from "./BandsChessboardPlots.module.scss";

const RYDBERG_TO_EV = 1 / 13.605693122994;

const BandsChessboardPlots: React.FC<BandsChessboardPlotsProps> = ({
  element,
  setBandShift,
  onTileClick: goToTab,
}) => {
  const { loadingMetadata, setActivePseudos } = useContext(PseudosContext);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [pseudoFilenames, setPseudoFilenames] = useState<string[]>([]);
  const [etaV, setEtaV] = useState<number[][]>([]);
  const [etaV10, setEtaV10] = useState<number[][]>([]);
  const [shifts, setShifts] = useState<number[][]>([]);

  useEffect(() => {
    if (!element) return;
    SsspDataService.fetchBandChessboardData(element)
      .then((data) => {
        const filenames = Object.keys(data.pseudos);
        setPseudoFilenames(filenames);
        const n = filenames.length;
        const etaV = Array.from({ length: n }, () => Array(n).fill(0));
        const etaV10 = Array.from({ length: n }, () => Array(n).fill(0));
        const shifts = Array.from({ length: n }, () => Array(n).fill(0));
        for (let i = 0; i < n; i++) {
          for (let j = i + 1; j < n; j++) {
            const key1 = `${i}-${j}`;
            const key2 = `${j}-${i}`;
            const vData = data.v_distance[key1] || data.v_distance[key2];
            const v10Data = data.v10_distance[key1] || data.v10_distance[key2];
            etaV[i][j] = vData.max_diff_c;
            etaV[j][i] = etaV[i][j];
            etaV10[i][j] = v10Data.max_diff_c;
            etaV10[j][i] = etaV10[i][j];
            shifts[i][j] = vData.shift_c * RYDBERG_TO_EV;
            shifts[j][i] = shifts[i][j];
          }
        }
        setEtaV(etaV);
        setEtaV10(etaV10);
        setShifts(shifts);
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

  const tileClickHandler = (pseudos: string[], pointIndex: number[]) => {
    setActivePseudos(pseudos);
    setBandShift(shifts[pointIndex[0]][pointIndex[1]]);
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
