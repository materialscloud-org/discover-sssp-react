import { useContext } from "react";

import { HoverContext } from "@sssp/context";

import PseudosLegendProps from "./Legend.models";
import styles from "./Legend.module.scss";

const PseudosLegend: React.FC<PseudosLegendProps> = ({ pseudoMetadata }) => {
  const { hoveredPseudo, hoveredElement, setHoveredPSeudo } =
    useContext(HoverContext);

  return (
    <ul id={styles["pseudo-legend"]} onMouseLeave={() => setHoveredPSeudo("")}>
      {Object.entries(pseudoMetadata).map(([pseudo, metadata]) => (
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
          onMouseEnter={() => setHoveredPSeudo(pseudo)}
        >
          <span
            className={styles["pseudo-list-marker"]}
            style={{ backgroundColor: metadata.background_color }}
          ></span>
          <span className={styles["pseudo-name"]}>{metadata.display_name}</span>
        </li>
      ))}
    </ul>
  );
};

export default PseudosLegend;
