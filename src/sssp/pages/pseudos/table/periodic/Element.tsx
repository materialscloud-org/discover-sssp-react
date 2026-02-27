import { useContext } from "react";
import { Link } from "react-router-dom";

import { HoverContext } from "@sssp/context";
import { ElementModel } from "@sssp/models";

import ElementProps from "./Element.models";
import styles from "./Element.module.scss";

const Element: React.FC<ElementProps> = ({ number, symbol, color, info }) => {
  const { hoveredPseudo, setHoveredElement } = useContext(HoverContext);

  const classes = [styles.element, styles[`element-${number}`]];

  let cutoffText = null;

  if (!info) {
    classes.push(styles.disabled);
  }

  if (info) {
    const { cutoff_wfc: wfcCutoff, cutoff_rho: rhoCutoff } = info;
    cutoffText = (
      <div className={styles.info}>
        {wfcCutoff}
        <sub>{rhoCutoff}</sub>
      </div>
    );

    if (hoveredPseudo && hoveredPseudo !== info.library) {
      classes.push(styles.transparent);
    }
  } else if (hoveredPseudo) {
    classes.push(styles.transparent);
  }

  const objectify = (): ElementModel => ({
    number: number,
    symbol: symbol,
    color: color,
    info: info,
  });

  return (
    <Link
      className={`${classes.join(" ")} button-link`}
      style={{ background: color }}
      onMouseEnter={() => setHoveredElement(objectify())}
      onMouseLeave={() => setHoveredElement(undefined)}
      to={`../${symbol}`}
    >
      <div className={styles.symbol}>{symbol}</div>
      {cutoffText}
    </Link>
  );
};

export default Element;
