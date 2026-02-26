import { useContext, useMemo } from "react";

import { LoadingSpinner, NoDataMessage } from "@sssp/components";
import { ElementContext, PlotContext, PseudoContext } from "@sssp/context";
import { PseudosMetadata } from "@sssp/models";

import PlotPaneHeader from "../PlotPaneHeader";
import CategorySelector from "./CategorySelector";
import styles from "./ConvergencePane.module.scss";
import ConvergencePlot from "./ConvergencePlot";
import ConvergencePlotDetails from "./ConvergencePlotDetails";

const ConvergencePane: React.FC = () => {
  const { element } = useContext(ElementContext);
  const {
    loadingMetadata,
    categories,
    pseudosMetadata,
    activeCategories,
    setActiveCategories,
  } = useContext(PseudoContext);
  const { loadingPlotData, convergenceData } = useContext(PlotContext);

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

  const isLoading = loadingMetadata || loadingPlotData;

  const hasData = Object.keys(convergenceData).length > 0;

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <div id={styles.convergencePane}>
      <PlotPaneHeader
        title={`Verification Summary: ${element} ${convergenceData.conff ? `(${convergenceData.conff})` : ""}`}
      />
      {hasData && (
        <div id={styles.categorySelectorContainer}>
          <CategorySelector
            categories={categories}
            activeCategories={activeCategories}
            onCategorySelect={setActiveCategories}
          />
        </div>
      )}
      {!hasData ? (
        <NoDataMessage />
      ) : !activePseudos.length ? (
        <div id={styles.noCategorySelected}>
          <NoDataMessage />
        </div>
      ) : (
        <div id={styles.convergenceSummaryContent}>
          <div id={styles.plotTitle}>
            <h6>Error w.r.t. ref. wavefunction cutoff</h6>
          </div>
          <ConvergencePlot
            element={element}
            activePseudos={activePseudos}
            pseudosMetadata={activePseudosMetadata}
          />
        </div>
      )}
      <div id={styles.convergencePlotDetailsContainer}>
        <ConvergencePlotDetails />
      </div>
    </div>
  );
};

export default ConvergencePane;
