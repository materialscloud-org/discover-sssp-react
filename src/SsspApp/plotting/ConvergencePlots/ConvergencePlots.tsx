import { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { CategorySelector, LoadingSpinner } from "@sssp/components";
import { PseudosContext } from "@sssp/context";
import { PseudosMetadata } from "@sssp/models";

import ConvergencePlot from "./ConvergencePlot";
import ConvergencePlotsProps from "./ConvergencePlots.models";
import styles from "./ConvergencePlots.module.scss";

const ConvergencePlots: React.FC<ConvergencePlotsProps> = ({ element }) => {
  const { loadingMetadata, categories, categorizedPseudosMetadata } =
    useContext(PseudosContext);
  const [activeCategories, setActiveCategories] = useState<string[]>(
    Object.keys(categorizedPseudosMetadata)
  );

  const pseudosMetadata = useMemo(
    (): PseudosMetadata =>
      Object.assign(
        {},
        ...activeCategories.map(
          (category) => categorizedPseudosMetadata[category]
        )
      ),
    [activeCategories, categorizedPseudosMetadata]
  );

  return loadingMetadata ? (
    <LoadingSpinner />
  ) : (
    <div id="convergence-summary">
      <CategorySelector
        categories={categories}
        activeCategories={activeCategories}
        onCategorySelect={setActiveCategories}
      />
      <div id={styles["convergence-plot-container"]}>
        <ConvergencePlot element={element} pseudosMetadata={pseudosMetadata} />
      </div>
      <hr />
      <div id={styles["convergence-plot-description"]}>
        Convergence pattern plots according to the SSSP protocol: zone-boundary
        phonons, cohesive energy, pressure and band structure versus the
        wavefunction cutoff for all the considered pseudopotential libraries
        (the colored horizontal dashed lines correspond to the thresholds of the
        SSSP efficiency criteria, whereas the gray dotted lines correspond to
        the precision criteria). The recommended efficiency (precision)
        pseudopotential is marked with a dotted bounding square (circle) at the
        recommended cutoff. On the right-hand side we report the number of
        valence electrons of the pseudopotential, the delta-factor with respect
        to the reference all-electron results and the maximum phonon frequency.
        All calculations are performed on the ground-state elemental solids
        unless stated otherwise (i.e. rare-earths and flourine). The circle
        marks the pseudopotential and wavefunction cutoff chosen for the SSSP
        library (see <Link to="/about">About SSSP</Link> for more details).
      </div>
    </div>
  );
};

export default ConvergencePlots;
