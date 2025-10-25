import { DATA_URL } from "@sssp/common/config";
import { useEffect, useMemo, useState } from "react";

import BandsChessboardPlotsProps from "./BandsChessboardPlots.models";
import styles from "./BandsChessboardPlots.module.scss";

const BandsChessboardPlots: React.FC<BandsChessboardPlotsProps> = ({
  element,
  elementData,
  activeLibrary,
}) => {
  const [errored, setErrored] = useState(false);

  const filename = useMemo(() => {
    const filenames = (elementData.chessboards_filenames ?? []) as string[];
    return filenames[0] ?? "";
  }, [elementData.chessboards_filenames]);

  const source = useMemo(
    () =>
      filename ? `${DATA_URL}/${activeLibrary}/chessboards/${filename}` : "",
    [filename, activeLibrary]
  );

  useEffect(() => {
    setErrored(false);
  }, [source]);

  return (
    <div className={styles["chessboard-plot"]}>
      {!source || errored ? (
        <span>No data available</span>
      ) : (
        <img
          src={source}
          alt={`Bands chessboard plots for ${element}`}
          onError={() => setErrored(true)}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
};

export default BandsChessboardPlots;
