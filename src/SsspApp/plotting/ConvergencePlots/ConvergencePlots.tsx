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
      <div id={styles["convergence-plot-description"]}>
        <h5>Convergence pattern plots according to the SSSP protocol</h5>
        <p>
          We report here the zone-boundary phonons, cohesive energy, pressure,
          and band structure versus the wavefunction cutoff for all the
          considered pseudopotential libraries.
        </p>
        <p>
          The colored horizontal dashed lines correspond to the thresholds of
          the SSSP efficiency criteria, whereas the gray dotted lines correspond
          to the precision criteria. The recommended efficiency (precision)
          pseudopotential is marked with a colored{" "}
          <span style={{ color: "green" }}>square</span> (
          <span style={{ color: "red" }}>circle</span>) at the recommended
          cutoff.
        </p>
        On the left, we report:
        <ul>
          <li>the number of valence electrons of the pseudopotential</li>
          <li>
            the delta-factor with respect to the reference all-electron results
          </li>
          <li>the maximum phonon frequency</li>
        </ul>
        <p>
          All calculations are performed on the ground-state elemental solids
          unless stated otherwise (i.e. rare-earths and flourine). (see{" "}
          <Link to="/about" style={{ textDecoration: "none" }}>
            About SSSP
          </Link>{" "}
          for more details).
        </p>
      </div>
      <hr />
      <CategorySelector
        categories={categories}
        activeCategories={activeCategories}
        onCategorySelect={setActiveCategories}
      />
      <div id={styles["convergence-plot-container"]}>
        <ConvergencePlot element={element} pseudosMetadata={pseudosMetadata} />
      </div>
    </div>
  );
};

export default ConvergencePlots;
