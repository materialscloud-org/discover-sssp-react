import { useContext } from "react";

import { LoadingSpinner } from "@sssp/components";
import { HoverContext, PseudosContext } from "@sssp/context";

import styles from "./Legend.module.scss";

const PseudosLegend: React.FC = () => {
  const { hoveredPseudo, hoveredElement, setHoveredPseudo } =
    useContext(HoverContext);
  const { loadingMetadata, pseudosMetadata, maxPseudoWidth } =
    useContext(PseudosContext);

  return loadingMetadata ? (
    <LoadingSpinner />
  ) : (
    <ul id={styles["pseudos-legend"]} onMouseLeave={() => setHoveredPseudo("")}>
      {Object.entries(pseudosMetadata).map(([pseudo, metadata]) => (
        <li
          key={pseudo}
          className={`
            ${styles["pseudo-item"]}
              ${
                !(hoveredPseudo || hoveredElement)
                  ? ""
                  : hoveredPseudo === pseudo ||
                    hoveredElement?.info.pseudopotential === pseudo
                  ? styles["highlighted"]
                  : styles["transparent"]
              }
            `}
          onMouseEnter={() => setHoveredPseudo(pseudo)}
        >
          <span
            className={styles["pseudo-list-marker"]}
            style={{ backgroundColor: metadata.color }}
          ></span>
          <span
            className={styles["pseudo-name"]}
            style={{ width: maxPseudoWidth + 12 }}
          >
            {metadata.display_name}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default PseudosLegend;
