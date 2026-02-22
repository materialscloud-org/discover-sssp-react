import { useContext, useMemo } from "react";

import { ElementContext } from "@sssp/context";

import { PlotHeaderProps } from "./PlotPaneHeader.models";
import styles from "./PlotPaneHeader.module.scss";

const PlotPaneHeader: React.FC<PlotHeaderProps> = ({ title }) => {
  const { element, elementsInfo } = useContext(ElementContext);

  const selectedPseudos = useMemo(
    () => ({
      efficiency: elementsInfo.efficiency[element]?.pseudopotential,
      precision: elementsInfo.precision[element]?.pseudopotential,
    }),
    [element, elementsInfo],
  );

  const hasSelectedPseudos =
    selectedPseudos.efficiency || selectedPseudos.precision;

  return (
    <header id={styles.plotPaneHeader}>
      <h2 className="display-6">{title}</h2>
      {hasSelectedPseudos && (
        <div id={styles.selectedPseudos}>
          <span id={styles.efficiencyPseudo}>
            <b>SSSP Efficiency</b>: {selectedPseudos.efficiency}
          </span>
          <span id={styles.precisionPseudo}>
            <b>SSSP Precision</b>: {selectedPseudos.precision}
          </span>
        </div>
      )}
    </header>
  );
};

export default PlotPaneHeader;
