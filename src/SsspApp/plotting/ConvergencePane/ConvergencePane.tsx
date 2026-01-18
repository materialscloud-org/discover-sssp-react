import { useContext, useEffect, useMemo, useState } from "react";

import { CategorySelector, LoadingSpinner } from "@sssp/components";
import { PseudosContext } from "@sssp/context";
import { PseudoConvergenceData } from "@sssp/models";
import SsspDataService from "@sssp/services/data";

import ConvergencePaneProps from "./ConvergencePane.models";
import styles from "./ConvergencePane.module.scss";
import ConvergencePlot from "./ConvergencePlot";
import ConvergencePlotDetails from "./ConvergencePlotDetails";

const ConvergencePane: React.FC<ConvergencePaneProps> = ({ element }) => {
  const [loadingData, setLoadingData] = useState(true);
  const [summaryData, setSummaryData] = useState({} as PseudoConvergenceData);
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

  useEffect(() => {
    if (!element) return;

    setLoadingData(true);
    setSummaryData({} as PseudoConvergenceData);

    SsspDataService.fetchPseudosSummaryData(element)
      .then((data) => {
        setSummaryData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setSummaryData({} as PseudoConvergenceData);
      })
      .finally(() => {
        setLoadingData(false);
      });
  }, [element]);

  const isLoading = loadingData || loadingMetadata;

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <div id="convergence-summary">
      <div id={styles["convergence-summary-header"]}>
        <h2 className="display-6">
          Verification summary: {element} ({summaryData.conff})
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
          summaryData={summaryData}
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
