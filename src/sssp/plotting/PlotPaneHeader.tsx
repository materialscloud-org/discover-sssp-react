import { useContext } from "react";

import { ElementContext } from "@sssp/context";

import { PlotHeaderProps } from "./PlotPaneHeader.models";
import styles from "./PlotPaneHeader.module.scss";

const PlotPaneHeader: React.FC<PlotHeaderProps> = ({ title }) => {
  const { ssspPseudos } = useContext(ElementContext);

  const hasSelectedPseudos = ssspPseudos.efficiency || ssspPseudos.precision;

  return (
    <header id={styles.plotPaneHeader}>
      <h2 className="display-6">{title}</h2>
      {hasSelectedPseudos && (
        <div id={styles.ssspPseudos}>
          <span id={styles.efficiencyPseudo}>
            <b>SSSP Efficiency</b>: {ssspPseudos.efficiency}
          </span>
          <span id={styles.precisionPseudo}>
            <b>SSSP Precision</b>: {ssspPseudos.precision}
          </span>
        </div>
      )}
    </header>
  );
};

export default PlotPaneHeader;
