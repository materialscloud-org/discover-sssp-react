import { useContext } from "react";

import { HoverContext, PseudoContext } from "@sssp/context";

import styles from "./DetailsBox.module.scss";

const DetailsBox: React.FC = () => {
  const { pseudosMetadata } = useContext(PseudoContext);
  const { hoveredElement, hoveredPseudo } = useContext(HoverContext);

  if (!hoveredElement && !hoveredPseudo) return null;

  let Details = () => <></>;

  if (hoveredElement) {
    const { number, symbol, color, info } = hoveredElement;
    Details = () => (
      <div id={styles.detailsBox} style={{ color: color }}>
        <div id={styles.elementDetails}>
          <div id={styles.elementInfo}>
            <span id={styles.zValue}>
              Z<sub>val</sub> = {info.Z}
            </span>
            <div id={styles.labelInfo}>
              <span id={styles.atomicNumber}>{number}</span>
              <span id={styles.symbol}>{symbol}</span>
            </div>
          </div>
          <div id={styles.cutoffsInfo}>
            <span id={styles.cutoffHeader}>Cutoffs</span>
            <ul>
              <li>
                <span className={styles.cutoffLabel}>Ψ</span>: {info.cutoff_wfc}{" "}
                Ry
              </li>
              <li>
                <span className={styles.cutoffLabel}>ρ</span>: {info.cutoff_rho}{" "}
                Ry
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  } else if (hoveredPseudo) {
    const { color, category } = pseudosMetadata[hoveredPseudo];
    const longCategory =
      category === "nc"
        ? "Norm-conserving"
        : category === "us"
          ? "Ultrasoft"
          : category === "paw"
            ? "PAW"
            : category;
    Details = () => {
      return (
        <div id={styles.detailsBox} style={{ color: color }}>
          <div id={styles.pseudoDetails}>
            <div id={styles.pseudoInfo}>
              <span id={styles.pseudoName}>{hoveredPseudo}</span>
              <div id={styles.pseudoCategory}>{longCategory}</div>
            </div>
          </div>
        </div>
      );
    };
  }

  return <Details />;
};

export default DetailsBox;
