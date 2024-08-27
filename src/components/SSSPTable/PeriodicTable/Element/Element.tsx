import React from "react";
import { Link } from "react-router-dom";

import { ElementModel, ElementProps } from "./Element.models";

import styles from "./Element.module.scss";

const Element: React.FC<ElementProps> = ({
  number,
  symbol,
  color,
  info,
  isTransparent,
  onHover,
}) => {
  const disabled = info == null;

  const classes = [
    styles["element"],
    styles[`element-${number}`],
    disabled ? styles["disabled"] : "",
    isTransparent ? styles["transparent"] : "",
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

  const objectify = (): ElementModel => {
    return { number: number, symbol: symbol, color: color, info: info };
  };

  return (
    <div
      className={classes}
      style={{ background: color }}
      onMouseEnter={() => onHover(objectify())}
      onMouseLeave={() => onHover(null)}
    >
      <Link to={`../${symbol}`} state={""}>
        <div className={styles["symbol"]}>{symbol}</div>
        {cutoffText}
      </Link>
    </div>
  );
};

export default Element;
