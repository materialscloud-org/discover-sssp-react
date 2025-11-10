import { useContext } from "react";

import { HoverContext } from "@sssp/context";

import styles from "./DetailsBox.module.scss";

const DetailsBox = () => {
  const { hoveredElement } = useContext(HoverContext);
  if (!hoveredElement) return <></>;
  const { number, symbol, color, info } = hoveredElement;

  return (
    <div id={styles["details"]} style={{ color: color }}>
      <div id={styles["element-info"]}>
        <span id={styles["z-value"]}>Z = {info.Z}</span>
        <div id={styles["label-info"]}>
          <div id={styles["atomic-info"]}>
            <span id={styles["atomic-number"]}>{number}</span>
            <span id={styles["atomic-mass"]}>?</span>
          </div>
          <span id={styles["symbol"]}>{symbol}</span>
        </div>
      </div>
      <div id={styles["cutoffs-info"]}>
        <span id={styles["cutoff-header"]}>Cutoffs</span>
        <ul>
          <li>
            <span className={styles["cutoff-label"]}>Ψ</span>: {info.cutoff_wfc}{" "}
            Ry
          </li>
          <li>
            <span className={styles["cutoff-label"]}>ρ</span>: {info.cutoff_rho}{" "}
            Ry
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DetailsBox;
