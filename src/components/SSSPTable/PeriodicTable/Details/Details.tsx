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
    <div id={styles["details"]} style={{ color: color }}>
      <div id={styles["label"]}>
        <div id={styles["number"]}>{number}</div>
        <div id={styles["symbol"]}>{symbol}</div>
      </div>
      <div>
        <ul id={styles["info"]}>
          <li id={styles["cutoff-header"]}>Cutoffs</li>
          <li>Ψ = {info.cutoff}</li>
          <li>ρ = {info.rho_cutoff}</li>
        </ul>
      </div>
    </div>
  );
};

export default Details;
