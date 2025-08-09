import { useState } from "react";
import { Card, Tab, Tabs } from "react-bootstrap";
import { Link } from "react-router-dom";

import { ElementDataResponse } from "@sssp/services/models";

import { OverviewPlotsProps } from "./OverviewPlots.models";
import styles from "./OverviewPlots.module.scss";

import { IMAGE_DATA_BASE_URL } from "../../../common/config";

const OverviewPlots: React.FC<OverviewPlotsProps> = ({
  element,
  elementData,
  activeAccuracy,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const key = `${activeAccuracy}_filenames` as keyof ElementDataResponse;
  const filenames = (elementData[key] || []) as string[];

  if (filenames) {
    filenames.sort((a, b) => {
      const aConvergence = a.split("_")[1];
      const bConvergence = b.split("_")[1];
      return parseFloat(aConvergence) - parseFloat(bConvergence);
    });
  }

  return (
    <div id="overview-plots">
      <div id="convergence-panels">
        <Tabs
          activeKey={activeTab}
          onSelect={(tabIndex) => setActiveTab(parseInt(tabIndex || "0"))}
        >
          {filenames.map((filename, index) => {
            const convergence = filename.split("_")[1];
            const title = `Convergence ${activeAccuracy} - ${convergence}`;
            const source = `${IMAGE_DATA_BASE_URL}/convergences_${activeAccuracy}/${filename}`;
            return (
              <Tab eventKey={index} title={title} key={index}>
                <Card.Body className="overview-card">
                  <OverviewPlot element={element} source={source} />
                </Card.Body>
              </Tab>
            );
          })}
        </Tabs>
      </div>
      <div id={styles["overview-note"]}>
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

interface OverviewPlotProps {
  element: string;
  source: string;
}

const OverviewPlot: React.FC<OverviewPlotProps> = ({ element, source }) => {
  return (
    <div className={styles["overview-plot"]}>
      <img src={source} alt={`Convergence pattern for ${element}`} />
    </div>
  );
};

export default OverviewPlots;
