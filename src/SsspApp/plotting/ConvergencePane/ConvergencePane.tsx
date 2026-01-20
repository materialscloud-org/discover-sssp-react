import { useContext, useMemo } from "react";

import { CategorySelector, LoadingSpinner } from "@sssp/components";
import { ElementContext, PlotContext, PseudoContext } from "@sssp/context";

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
  const { loadingConvergenceData, convergenceData } = useContext(PlotContext);

  const activePseudosMetadata = useMemo(() => {
    const activePseudos: Record<string, any> = {};
    Object.entries(pseudosMetadata).forEach(([pseudo, metadata]) => {
      if (activeCategories.includes(metadata.category)) {
        activePseudos[pseudo] = metadata;
      }
    });
    return activePseudos;
  }, [activeCategories, pseudosMetadata]);

  const isLoading = loadingMetadata || loadingConvergenceData;

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <div id="convergence-summary">
      <div id={styles["convergence-summary-header"]}>
        <h2 className="display-6">
          Verification summary: {element} ({convergenceData.conff})
        </h2>
        <CategorySelector
          categories={categories}
          activeCategories={activeCategories}
          onCategorySelect={setActiveCategories}
        />
      </div>
      <div id={styles["convergence-plot-container"]}>
        <ConvergencePlot
          element={element}
          summaryData={convergenceData}
          pseudosMetadata={activePseudosMetadata}
        />
      </div>
      <div id={styles["convergence-plot-details-container"]}>
        <ConvergencePlotDetails />
      </div>
    </div>
  );
};

export default ConvergencePane;
