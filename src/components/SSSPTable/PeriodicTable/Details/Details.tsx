import { useContext } from "react";

import HoverContext from "components/SSSPTable/context/HoverContext";

import styles from "./Details.module.scss";

const Details = () => {
  const { hoveredElement } = useContext(HoverContext);
  if (!hoveredElement) {
    return <></>;
  }
  const { number, symbol, color, info } = hoveredElement;
  return (
    <div className={styles["details"]} style={{ borderColor: color }}>
      <div className={styles["label"]}>
        <div className={styles["number"]} style={{ color: color }}>
          {number}
        </div>
        <div className={styles["symbol"]} style={{ color: color }}>
          {symbol}
        </div>
      </div>
      <div>
        <ul className={styles["info"]}>
          <li className={styles["cutoff-header"]} style={{ color: color }}>
            Cutoffs
          </li>
          <li>Ψ = {info.cutoff}</li>
          <li>ρ = {info.rho_cutoff}</li>
        </ul>
      </div>
    </div>
  );
};

export default Details;
