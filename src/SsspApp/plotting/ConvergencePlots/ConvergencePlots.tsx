import { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { CategorySelector, LoadingSpinner } from "@sssp/components";
import { PseudosContext } from "@sssp/context";

import ConvergencePlot from "./ConvergencePlot";
import ConvergencePlotsProps from "./ConvergencePlots.models";
import styles from "./ConvergencePlots.module.scss";
import { Accordion } from "react-bootstrap";

const ConvergencePlots: React.FC<ConvergencePlotsProps> = ({ element }) => {
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
      <Accordion id={styles["convergence-plot-description"]}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <h5>Convergence pattern plots according to the SSSP protocol</h5>
          </Accordion.Header>
          <Accordion.Body>
            <p>
              We report here the zone-boundary phonons, cohesive energy,
              pressure, and band structure versus the wavefunction cutoff for
              all the considered pseudopotential libraries.
            </p>
            <p>
              The colored horizontal dashed lines correspond to the thresholds
              of the SSSP efficiency criteria, whereas the gray dotted lines
              correspond to the precision criteria. The recommended efficiency
              (precision) pseudopotential is marked with a colored{" "}
              <span style={{ color: "green" }}>square</span> (
              <span style={{ color: "red" }}>circle</span>) at the recommended
              cutoff.
            </p>
            On the left, we report:
            <ul>
              <li>the number of valence electrons of the pseudopotential</li>
              <li>
                the average of <b>ν</b>, a *metric relating to the equation of
                state, across 10 structures
              </li>
              <li>
                the maximum <b>ν</b> value
              </li>
              <li>
                the average of <b>ν</b>, excluding the XO<sub>3</sub> structure
              </li>
            </ul>
            <p>
              *See the <b>About</b> tab of the{" "}
              <a
                href="https://acwf-verification.materialscloud.org/"
                target="_blank"
                style={{ textDecoration: "none" }}
              >
                Verification of the precision of DFT implementations via AiiDA
                common workflows
              </a>{" "}
              app to learn more about how <b>ν</b> is computed.
            </p>
            <p>
              All calculations are performed on the ground-state elemental
              solids unless stated otherwise (i.e. rare-earths and flourine).
              See{" "}
              <Link to="/about" style={{ textDecoration: "none" }}>
                About SSSP
              </Link>{" "}
              for more details.
            </p>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
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

export default ConvergencePlots;
