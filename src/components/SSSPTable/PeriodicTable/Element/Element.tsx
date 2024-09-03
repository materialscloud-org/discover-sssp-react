import { useContext } from "react";
import { Link } from "react-router-dom";

import AccuracyContext from "context/AccuracyContext";
import HoverContext from "context/HoverContext";

import { ElementModel } from "./Element.models";

import styles from "./Element.module.scss";

const Element: React.FC<ElementModel> = ({ number, symbol, color, info }) => {
  const { activeAccuracy } = useContext(AccuracyContext);
  const { hoveredPseudo, setHoveredElement } = useContext(HoverContext);

  const classes = [styles["element"], styles[`element-${number}`]];

  let cutoffText = null;

  if (info) {
    const { cutoff: wfcCutoff, rho_cutoff: rhoCutoff } = info;
    cutoffText = (
      <div className={styles["info"]}>
        {wfcCutoff}
        <sub>({rhoCutoff})</sub>
      </div>
    );

    if (hoveredPseudo && hoveredPseudo !== info.pseudopotential) {
      classes.push(styles["transparent"]);
    }
  } else {
    classes.push(styles["disabled"]);
  }

  const objectify = (): ElementModel => ({
    number: number,
    symbol: symbol,
    color: color,
    info: info,
  });

  return (
    <Link
      className={classes.join(" ")}
      style={{ background: color }}
      onMouseEnter={() => setHoveredElement(objectify())}
      onMouseLeave={() => setHoveredElement(undefined)}
      to={`../${symbol}#${activeAccuracy}`}
    >
      <div className={styles["symbol"]}>{symbol}</div>
      {cutoffText}
    </Link>
  );
};

export default Element;
