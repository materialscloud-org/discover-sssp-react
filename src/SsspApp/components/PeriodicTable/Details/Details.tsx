import { useContext } from "react";

import { HoverContext } from "@sssp/context";

import styles from "./Details.module.scss";

const Details = () => {
  const { hoveredElement } = useContext(HoverContext);
  if (!hoveredElement) return <></>;
  const { number, symbol, color, info } = hoveredElement;

  return (
    <div id={styles["details"]} style={{ color: color }}>
      <div id={styles["label"]}>
        <div id={styles["number"]}>{number}</div>
        <div id={styles["symbol"]}>{symbol}</div>
      </div>
      <div id={styles["info"]}>
        <h4 id={styles["cutoff-header"]}>Cutoffs</h4>
        <ul>
          <li>
            <span className={styles["cutoff-label"]}>Ψ</span>: {info.cutoff} Ry
          </li>
          <li>
            <span className={styles["cutoff-label"]}>ρ</span>: {info.rho_cutoff}{" "}
            Ry
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Details;
