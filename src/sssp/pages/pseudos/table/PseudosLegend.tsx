import { useContext } from "react";

import { LoadingSpinner } from "@sssp/components";
import { HoverContext, PseudoContext } from "@sssp/context";

import styles from "./PseudosLegend.module.scss";

const PseudosLegend: React.FC = () => {
  const { hoveredPseudo, hoveredElement, setHoveredPseudo } =
    useContext(HoverContext);
  const { loadingMetadata, pseudosMetadata, maxPseudoWidth } =
    useContext(PseudoContext);

  return loadingMetadata ? (
    <LoadingSpinner />
  ) : (
    <ul id={styles.pseudosLegend} onMouseLeave={() => setHoveredPseudo("")}>
      {Object.entries(pseudosMetadata).map(([pseudo, metadata]) => (
        <li
          key={pseudo}
          className={`
              ${styles.pseudoItem}
                ${
                  !(hoveredPseudo || hoveredElement)
                    ? ""
                    : hoveredPseudo === pseudo ||
                        hoveredElement?.info.library === pseudo
                      ? styles.highlighted
                      : styles.transparent
                }
              `}
          onMouseEnter={() => setHoveredPseudo(pseudo)}
        >
          <span
            className={styles.pseudoListMarker}
            style={{ backgroundColor: metadata.color }}
          ></span>
          <span
            className={styles.pseudoName}
            style={{ width: maxPseudoWidth + 12 }}
          >
            {metadata.displayName}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default PseudosLegend;
