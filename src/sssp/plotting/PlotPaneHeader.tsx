import { useContext } from "react";

import { ElementContext, PseudoContext } from "@sssp/context";

import { PlotHeaderProps } from "./PlotPaneHeader.models";
import styles from "./PlotPaneHeader.module.scss";

const PlotPaneHeader: React.FC<PlotHeaderProps> = ({ title }) => {
  const { ssspPseudos } = useContext(ElementContext);
  const { pseudosMetadata } = useContext(PseudoContext);

  const hasSsspPseudos =
    ssspPseudos && (ssspPseudos.efficiency || ssspPseudos.precision);

  return (
    <header id={styles.plotPaneHeader}>
      <h2 className="display-6">{title}</h2>
      {hasSsspPseudos && (
        <div id={styles.ssspPseudos}>
          <div id={styles.efficiencyPseudo}>
            <span className={styles.pseudoLabel}>SSSP Efficiency:</span>{" "}
            {ssspPseudos.efficiency ? (
              <span
                style={{
                  color:
                    pseudosMetadata[ssspPseudos.efficiency.library]?.color ||
                    "black",
                }}
              >
                {`${ssspPseudos.efficiency?.library}-Z=${ssspPseudos.efficiency?.Z}`}
              </span>
            ) : (
              <span style={{ color: "gray" }}>N/A</span>
            )}
          </div>
          <div id={styles.precisionPseudo}>
            <span className={styles.pseudoLabel}>SSSP Precision:</span>{" "}
            <span
              style={{
                color:
                  pseudosMetadata[ssspPseudos.precision.library]?.color ||
                  "black",
              }}
            >
              {`${ssspPseudos.precision?.library}-Z=${ssspPseudos.precision?.Z}`}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};

export default PlotPaneHeader;
