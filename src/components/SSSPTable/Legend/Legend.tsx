import { PseudosLegendProps } from "./Legend.models";

import styles from "./Legend.module.scss";

const PseudosLegend: React.FC<PseudosLegendProps> = ({
  pseudoMetadata,
  hoveredPseudo,
  hoveredElement,
  onHover,
}) => {
  return (
    <ul className={styles["pseudo-legend"]} onMouseLeave={() => onHover("")}>
      {Object.entries(pseudoMetadata).map(([pseudo, metadata]) => (
        <li
          key={pseudo}
          className={`${styles["pseudo-item"]} ${
            (hoveredPseudo && hoveredPseudo !== pseudo) ||
            (hoveredElement && hoveredElement.info.pseudopotential !== pseudo)
              ? styles["transparent"]
              : ""
          }`}
          onMouseEnter={() => onHover(pseudo)}
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
