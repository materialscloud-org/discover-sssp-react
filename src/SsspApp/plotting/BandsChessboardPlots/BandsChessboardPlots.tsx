import { BandsChessboardPlotsProps } from "./BandsChessboardPlots.models";
import styles from "./BandsChessboardPlots.module.scss";

import { IMAGE_DATA_BASE_URL } from "../../../common/config";

const BandsChessboardPlots: React.FC<BandsChessboardPlotsProps> = ({
  element,
  elementData,
  // activeAccuracy,
}) => {
  const filename = (elementData.chessboards_filenames || []) as string[];
  const source = `${IMAGE_DATA_BASE_URL}/chessboards/${filename}`;

  return (
    <div className={styles["chessboard-plot"]}>
      <img src={source} alt={`Bands chessboard plots for ${element}`} />
    </div>
  );
};

export default BandsChessboardPlots;
