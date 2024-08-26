import { PseudosLegendProps } from "./PseudosLegend.models";

import styles from "./PseudosLegend.module.scss";

const PseudosLegend = ({ pseudoMetadata, onHover }: PseudosLegendProps) => {
  return (
    <ul className={styles["pseudo-legend"]} onMouseLeave={() => onHover(null)}>
      {Object.entries(pseudoMetadata).map(([pseudo, metadata]) => (
        <li
          key={pseudo}
          className={styles["pseudo-item"]}
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
