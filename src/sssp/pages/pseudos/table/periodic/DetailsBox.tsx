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
    const metadata = pseudosMetadata[hoveredPseudo];
    const longCategory =
      metadata.category === "nc"
        ? "Norm-conserving"
        : metadata.category === "us"
          ? "Ultrasoft"
          : metadata.category === "paw"
            ? "PAW"
            : metadata.category;
    Details = () => {
      return (
        <div id={styles.detailsBox} style={{ color: metadata.color }}>
          <div id={styles.pseudoDetails}>
            <div id={styles.pseudoLibrary}>{metadata.library}</div>
            <div id={styles.pseudoCategory}>{longCategory}</div>
            {/* <small id={styles.pseudoDescription}>{metadata.description}</small> */}
          </div>
        </div>
      );
    };
  }

  return <Details />;
};

export default DetailsBox;
