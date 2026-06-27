import { useContext, useMemo } from "react";

import { LoadingSpinner } from "@sssp/components";
import { HoverContext, PseudoContext } from "@sssp/context";

import styles from "./PseudosLegend.module.scss";

const PseudosLegend: React.FC = () => {
  const { hoveredPseudo, hoveredElement, setHoveredPseudo } =
    useContext(HoverContext);
  const { loadingMetadata, pseudosMetadata } = useContext(PseudoContext);

  const maxPseudoWidth = useMemo(
    () =>
      Math.max(
        ...Object.keys(pseudosMetadata).map((pseudo) => pseudo.length * 10),
      ),
    [pseudosMetadata],
  );

  const getDynamicClassName = (pseudo: string) => {
    if (!hoveredPseudo && !hoveredElement) return "";
    if (hoveredPseudo === pseudo) return styles.highlighted;
    if (hoveredElement?.info?.library === pseudo) return styles.highlighted;
    return styles.transparent;
  };

  return loadingMetadata ? (
    <LoadingSpinner />
  ) : (
    <ul id={styles.pseudosLegend} onMouseLeave={() => setHoveredPseudo("")}>
      {Object.entries(pseudosMetadata).map(([pseudo, metadata]) => (
        <li
          key={pseudo}
          className={`${styles.pseudoItem} ${getDynamicClassName(pseudo)}`}
          style={{ width: maxPseudoWidth + 16 }}
          onMouseEnter={() => setHoveredPseudo(pseudo)}
        >
          <span
            className={styles.pseudoListMarker}
            style={{ backgroundColor: metadata.color }}
          ></span>
          <span className={styles.pseudoName}>{pseudo}</span>
        </li>
      ))}
    </ul>
  );
};

export default PseudosLegend;
