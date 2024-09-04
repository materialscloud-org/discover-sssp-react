import { Card, Tab, Tabs } from "react-bootstrap";
import { Link } from "react-router-dom";

import { ElementData } from "@sssp/services/models";

import { OverviewProps } from "./Overview.models";
import styles from "./Overview.module.scss";

const Overview: React.FC<OverviewProps> = ({ elementData }) => {
  const data = elementData.Y_series;

  return (
    <div id="overview-plots">
      <div id="convergence-panels">
        <Tabs defaultActiveKey="0">
          {Object.keys(Object.values(Object.values(data)[0])[0]).map(
            (convergence, index) => {
              const title = `Convergence Precision - ${convergence}`;
              return (
                <Tab eventKey={index} title={title} key={index}>
                  <Card.Body id="overview-card">
                    <OverviewPlot
                      elementData={elementData}
                      convergence={convergence}
                    />
                  </Card.Body>
                </Tab>
              );
            }
          )}
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
  elementData: ElementData;
  convergence: string;
}

const OverviewPlot: React.FC<OverviewPlotProps> = ({
  elementData,
  convergence,
}) => {
  return <div>Plot goes here</div>;
};

export default Overview;
