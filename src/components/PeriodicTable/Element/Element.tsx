import React from "react";
import { Link } from "react-router-dom";

import { ElementProps } from "./Element.models";

import styles from "./Element.module.scss";

const Element: React.FC<ElementProps> = ({ num, symbol, color, elemInfo }) => {
  const disabled = elemInfo == null;

  let eClass = `${styles["element"]} ${styles[`element-${num}`]}`;
  if (num >= 57 && num <= 71) {
    eClass += ` ${styles["lanthanide"]}`;
  }

  let cutoffText = null;
  if (!disabled) {
    const { cutoff: wfcCutoff, rho_cutoff: rhoCutoff } = elemInfo;
    cutoffText = (
      <div className={styles["elem-num"]}>
        {wfcCutoff}
        <sub>({rhoCutoff})</sub>
      </div>
    );
  }

  return (
    <Link
      to={symbol}
      className={`${eClass}${disabled ? ` ${styles["element-disabled"]}` : ""}`}
      style={{ background: color }}
    >
      <div className={styles["elem-sym"]}>{symbol}</div>
      {cutoffText}
    </Link>
  );
};

export default Element;
