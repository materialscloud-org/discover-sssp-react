import { useContext, useMemo } from "react";

import {
  CategorySelector,
  LoadingSpinner,
  NoDataMessage,
} from "@sssp/components";
import { ElementContext, PlotContext, PseudoContext } from "@sssp/context";
import { PseudosMetadata } from "@sssp/models";

import styles from "./ConvergencePane.module.scss";
import ConvergencePlot from "./ConvergencePlot";
import ConvergencePlotDetails from "./ConvergencePlotDetails";

const ConvergencePane: React.FC = () => {
  const { element, elementsInfo } = useContext(ElementContext);
  const {
    loadingMetadata,
    categories,
    pseudosMetadata,
    activeCategories,
    setActiveCategories,
  } = useContext(PseudoContext);
  const { loadingConvergenceData, convergenceData } = useContext(PlotContext);

  const selectedPseudos = useMemo(
    () => ({
      efficiency: elementsInfo.efficiency[element]?.pseudopotential,
      precision: elementsInfo.precision[element]?.pseudopotential,
    }),
    [element, elementsInfo],
  );

  const activePseudosMetadata = useMemo(() => {
    const activePseudos: PseudosMetadata = {};
    Object.entries(pseudosMetadata).forEach(([pseudo, metadata]) => {
      if (activeCategories.includes(metadata.category)) {
        activePseudos[pseudo] = metadata;
      }
    });
    return activePseudos;
  }, [activeCategories, pseudosMetadata]);

  const isLoading = loadingMetadata || loadingConvergenceData;

  const hasData = Object.keys(convergenceData).length > 0;

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <div id={styles.convergencePane}>
      <div id={styles.convergenceSummaryHeader}>
        <h2 className="display-6">
          Verification summary: {element}{" "}
          {convergenceData.conff ? `(${convergenceData.conff})` : ""}
        </h2>
        {hasData && (
          <div id={styles.selectedPseudosTitle}>
            <h5>SSSP Pseudopotentials</h5>
            <span id={styles.efficiencyPseudo}>
              <b>Efficiency</b>: {selectedPseudos.efficiency}
            </span>
            &nbsp; - &nbsp;
            <span id={styles.precisionPseudo}>
              <b>Precision</b>: {selectedPseudos.precision}
            </span>
          </div>
        )}
      </div>
      {!hasData ? (
        <NoDataMessage />
      ) : (
        <>
          <div id={styles.convergencePlotContainer}>
            <div id={styles.plotControls}>
              <CategorySelector
                categories={categories}
                activeCategories={activeCategories}
                onCategorySelect={setActiveCategories}
              />
            </div>
            {!activeCategories.length ? (
              <div id={styles.noCategorySelected}>
                <NoDataMessage />
              </div>
            ) : (
              <>
                <div id={styles.plotTitle}>
                  Error w.r.t. ref. wavefunction cutoff
                </div>
                <ConvergencePlot
                  element={element}
                  summaryData={convergenceData}
                  pseudosMetadata={activePseudosMetadata}
                />
              </>
            )}
          </div>
        </>
      )}
      <div id={styles.convergencePlotDetailsContainer}>
        <ConvergencePlotDetails />
      </div>
    </div>
  );
};

export default ConvergencePane;
