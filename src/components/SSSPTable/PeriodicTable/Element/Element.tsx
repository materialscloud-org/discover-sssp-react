import React from "react";
import { Link } from "react-router-dom";

import { ElementProps } from "./Element.models";

import styles from "./Element.module.scss";

const Element: React.FC<ElementProps> = ({ number, symbol, color, info }) => {
  const disabled = info == null;

  const classes = [
    styles["element"],
    styles[`element-${number}`],
    disabled ? styles["disabled"] : "",
  ].join(" ");

  let cutoffText = null;
  if (!disabled) {
    const { cutoff: wfcCutoff, rho_cutoff: rhoCutoff } = info;
    cutoffText = (
      <div className={styles["info"]}>
        {wfcCutoff}
        <sub>({rhoCutoff})</sub>
      </div>
    );
  }

  return (
    <div className={classes} style={{ background: color }}>
      <Link to={symbol}>
        <div className={styles["symbol"]}>{symbol}</div>
        {cutoffText}
      </Link>
    </div>
  );
};

export default Element;
