import { BandsChessboardPlotsProps } from "./BandsChessboardPlots.models";
import styles from "./BandsChessboardPlots.module.scss";

const ROOT = `/discover/sssp/src/SsspApp/data/chessboards`;

const BandsChessboardPlots: React.FC<BandsChessboardPlotsProps> = ({
  element,
  elementData,
  activeAccuracy,
}) => {
  const filename = (elementData.chessboards_filenames || []) as string[];
  const source = `${ROOT}/${filename}`;

  return (
    <div className={styles["chessboard-plot"]}>
      <img src={source} alt={`Bands chessboard plotsfor ${element}`} />
    </div>
  );
};

export default BandsChessboardPlots;
