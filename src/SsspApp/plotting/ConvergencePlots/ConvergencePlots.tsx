import { Link } from "react-router-dom";

import ConvergencePlot from "./ConvergencePlot";
import ConvergencePlotsProps from "./ConvergencePlots.models";
import styles from "./ConvergencePlots.module.scss";

const ConvergencePlots: React.FC<ConvergencePlotsProps> = ({
  element,
  activeLibrary,
}) => {
  return (
    <>
      <div id={styles["convergence-plot-container"]}>
        <ConvergencePlot element={element} library={activeLibrary} />
      </div>
      <hr />
      <div id={styles["convergence-plot-description"]}>
        Convergence pattern plots according to the SSSP protocol: zone-boundary
        phonons, cohesive energy, pressure and band structure versus the
        wavefunction cutoff for all the considered pseudopotential libraries
        (the horizontal dashed lines correspond to the thresholds of the SSSP
        selection criteria). On the right-hand side we report the number of
        valence electrons of the pseudopotential, the delta-factor with respect
        to the reference all-electron results and the maximum phonon frequency.
        All calculations are performed on the ground-state elemental solids
        unless stated otherwise (i.e. rare-earths and flourine). The circle
        marks the pseudopotential and wavefunction cutoff chosen for the SSSP
        library (see <Link to="/about">About SSSP</Link> for more details).
      </div>
    </>
  );
};

export default ConvergencePlots;
