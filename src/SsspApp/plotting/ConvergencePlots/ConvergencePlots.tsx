import { useState } from "react";
import { Card, Tab, Tabs } from "react-bootstrap";
import { Link } from "react-router-dom";

import { ElementDataResponse } from "@sssp/models";

import ConvergencePlot from "./ConvergencePlot";
import ConvergencePlotsProps from "./ConvergencePlots.models";
import styles from "./ConvergencePlots.module.scss";

const ConvergencePlots: React.FC<ConvergencePlotsProps> = ({
  element,
  elementData,
  activeLibrary,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const key = `${activeLibrary}_filenames` as keyof ElementDataResponse;
  const filenames = (elementData[key] || []) as string[];

  if (filenames) {
    filenames.sort((a, b) => {
      const aConvergence = a.split("_")[1];
      const bConvergence = b.split("_")[1];
      return parseFloat(aConvergence) - parseFloat(bConvergence);
    });
  }

  return (
    <div id="convergence-plots">
      {activeLibrary && (
        <div id={styles["convergence-panels"]}>
          <Tabs
            activeKey={activeTab}
            onSelect={(tabIndex) => setActiveTab(parseInt(tabIndex || "0"))}
          >
            {filenames.map((filename, index) => {
              const convergence = filename.split("_")[1];
              const title = `Convergence ${activeLibrary} - ${convergence}`;
              return (
                <Tab eventKey={index} title={title} key={index}>
                  <Card.Body id="convergence-card">
                    <ConvergencePlot
                      element={element}
                      library={activeLibrary}
                      convergence={convergence}
                    />
                  </Card.Body>
                </Tab>
              );
            })}
          </Tabs>
        </div>
      )}
      <div id="convergence-plot-note">
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
    </div>
  );
};

export default ConvergencePlots;
