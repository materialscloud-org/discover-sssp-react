import { useContext, useMemo } from "react";

import { LoadingSpinner, NoDataMessage } from "@sssp/components";
import { ElementContext, PlotContext, PseudoContext } from "@sssp/context";
import { PseudosMetadata } from "@sssp/models";

import CategorySelector from "./CategorySelector";
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

  const activePseudos = useMemo(() => {
    if (!convergenceData || !convergenceData.pseudos) return [];
    return convergenceData.pseudos
      .filter((pseudo) => activePseudosMetadata?.[pseudo.name])
      .reverse(); // reversed because we build it bottom-up in the plot
  }, [convergenceData, activePseudosMetadata]);

  const isLoading = loadingMetadata || loadingConvergenceData;

  const hasData = Object.keys(convergenceData).length > 0;

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <div id={styles.convergencePane}>
      <div id={styles.convergenceSummaryHeader}>
        <h2 className="display-6">
          Verification Summary: {element}{" "}
          {convergenceData.conff ? `(${convergenceData.conff})` : ""}
        </h2>
        {hasData && (
          <>
            <div id={styles.selectedPseudos}>
              <span id={styles.efficiencyPseudo}>
                <b>SSSP Efficiency</b>: {selectedPseudos.efficiency}
              </span>
              <span id={styles.precisionPseudo}>
                <b>SSSP Precision</b>: {selectedPseudos.precision}
              </span>
            </div>
            <CategorySelector
              categories={categories}
              activeCategories={activeCategories}
              onCategorySelect={setActiveCategories}
            />
          </>
        )}
      </div>
      {!hasData ? (
        <NoDataMessage />
      ) : !activePseudos.length ? (
        <div id={styles.noCategorySelected}>
          <NoDataMessage />
        </div>
      ) : (
        <>
          <div id={styles.plotTitle}>
            <h6>Error w.r.t. ref. wavefunction cutoff</h6>
          </div>
          <ConvergencePlot
            element={element}
            activePseudos={activePseudos}
            pseudosMetadata={activePseudosMetadata}
          />
        </>
      )}
      <div id={styles.convergencePlotDetailsContainer}>
        <ConvergencePlotDetails />
      </div>
    </div>
  );
};

export default ConvergencePane;
