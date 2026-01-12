import { useContext, useMemo, useState } from "react";

import { CategorySelector, LoadingSpinner } from "@sssp/components";
import { PseudosContext } from "@sssp/context";

import ConvergencePaneProps from "./ConvergencePane.models";
import styles from "./ConvergencePane.module.scss";
import ConvergencePlot from "./ConvergencePlot";
import ConvergencePlotDetails from "./ConvergencePlotDetails";

const ConvergencePane: React.FC<ConvergencePaneProps> = ({ element }) => {
  const { loadingMetadata, categories, pseudosMetadata } =
    useContext(PseudosContext);
  const [activeCategories, setActiveCategories] = useState(categories);

  const activePseudosMetadata = useMemo(() => {
    const activePseudos: Record<string, any> = {};
    Object.entries(pseudosMetadata).forEach(([pseudo, metadata]) => {
      if (activeCategories.includes(metadata.category)) {
        activePseudos[pseudo] = metadata;
      }
    });
    return activePseudos;
  }, [activeCategories, pseudosMetadata]);

  return loadingMetadata ? (
    <LoadingSpinner />
  ) : (
    <div id="convergence-summary">
      <ConvergencePlotDetails />
      <CategorySelector
        categories={categories}
        activeCategories={activeCategories}
        onCategorySelect={setActiveCategories}
      />
      <div id={styles["convergence-plot-container"]}>
        <ConvergencePlot
          element={element}
          pseudosMetadata={activePseudosMetadata}
        />
      </div>
    </div>
  );
};

export default ConvergencePane;
