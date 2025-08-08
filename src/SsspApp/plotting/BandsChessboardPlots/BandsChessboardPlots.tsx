import { BASE_URL } from "@sssp/common/config";

import { BandsChessboardPlotsProps } from "./BandsChessboardPlots.models";
import styles from "./BandsChessboardPlots.module.scss";

const BandsChessboardPlots: React.FC<BandsChessboardPlotsProps> = ({
  element,
  elementData,
  activeAccuracy,
}) => {
  const filename = (elementData.chessboards_filenames || []) as string[];
  const source = `${BASE_URL}/data/${activeAccuracy}/chessboards/${filename}`;

  return (
    <div className={styles["chessboard-plot"]}>
      <img src={source} alt={`Bands chessboard plots for ${element}`} />
    </div>
  );
};

export default BandsChessboardPlots;
