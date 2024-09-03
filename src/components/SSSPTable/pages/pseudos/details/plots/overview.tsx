import { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

import { fetchElementData } from "../service";
import { OverviewProps } from "./models";

const Overview: React.FC<OverviewProps> = ({ element }) => {
  const [convergence_files, setConvergenceFiles] = useState([""]);
  const [chessboard_filename, setChessboardFile] = useState("");

  const location = useLocation();
  const category = location.pathname.includes("efficiency")
    ? "Efficiency"
    : "Precision";

  const data_root = "data/discover/sssp";
  const convergence_root = `${data_root}/convergences_efficiency`;
  const chessboard_root = `${data_root}/chessboards`;

  useEffect(() => {
    fetchElementData(element).then((data) => {
      setConvergenceFiles(data.efficiency_filenames);
      setChessboardFile(data.chessboards_filenames);
    });
  }, [element]);

  return (
    <Tabs defaultActiveKey="0">
      {convergence_files.map((filename, index) => {
        const number = filename.match(/\d+(\.\d+)?/)?.[0] || "";
        const title = `Convergence ${category} - ${number}`;
        const id = index.toString();
        return (
          <Tab eventKey={id} title={title} key={id}>
            <div className="mt-3">
              <img src={convergence_root + "/" + filename} alt={filename} />
            </div>
            <div className="mt-2">
              Convergence pattern plots according to the SSSP protocol:
              zone-boundary phonons, cohesive energy, pressure and band
              structure versus the wavefunction cutoff for all the considered
              pseudopotential libraries (the horizontal dashed lines correspond
              to the thresholds of the SSSP selection criteria). On the
              right-hand side we report the number of valence electrons of the
              pseudopotential, the delta-factor with respect to the reference
              all-electron results and the maximum phonon frequency. All
              calculations are performed on the ground-state elemental solids
              unless stated otherwise (i.e. rare-earths and flourine). The
              circle marks the pseudopotential and wavefunction cutoff chosen
              for the SSSP library (see <Link to="/about">About SSSP</Link> for
              more details).
            </div>
          </Tab>
        );
      })}
      <Tab eventKey="bands" title="Bands Chessboards">
        <div className="mt-3">
          <img
            src={chessboard_root + "/" + chessboard_filename}
            alt={chessboard_filename}
          />
        </div>
      </Tab>
    </Tabs>
  );
};

export default Overview;
