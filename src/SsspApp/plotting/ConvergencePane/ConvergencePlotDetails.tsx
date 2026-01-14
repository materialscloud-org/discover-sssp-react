import { Accordion, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

import styles from "./ConvergencePlotDetails.module.scss";

const ConvergencePlotDetails: React.FC = () => (
  <Accordion id={styles["convergence-plot-description"]}>
    <Accordion.Item eventKey="0">
      <Accordion.Header>
        About the SSSP protocol convergence pattern plots
      </Accordion.Header>
      <Accordion.Body>
        <section>
          <p>
            We report here the zone-boundary phonons, cohesive energy, pressure,
            and band structure versus the wavefunction cutoff for all the
            considered pseudopotential libraries.
          </p>
          <p>
            The colored horizontal dashed lines correspond to the thresholds of
            the SSSP efficiency criteria, whereas the gray dotted lines
            correspond to the precision criteria. <br /> The recommended
            efficiency (precision) pseudopotential is marked with a colored{" "}
            <span style={{ color: "green" }}>square</span> (
            <span style={{ color: "red" }}>circle</span>) at the recommended
            cutoff.
          </p>
        </section>
        <section>
          <h5>Metadata</h5>
          We report on the left of the plot:
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
            Tip: click a pseudopotential label on the left to open its UPF
            viewer (available when an API backend is configured).
          </p>
        </section>
        <section>
          <h5>Legend</h5>
          <p>
            Each pseudopotential is represented in its own color. The legend
            items are kept in black and reflect the corresponding
            quantity/discrepancy across all pseudopotentials.
            <br />
            The markers correspond to the following quantities:
          </p>
          <Table
            id={styles["convergence-plot-legend-table"]}
            striped
            bordered
            responsive
          >
            <thead>
              <tr>
                <th>Marker</th>
                <th>Quantity</th>
                <th>Units</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>●</td>
                <td>δω</td>
                <td>%</td>
                <td>
                  Discrepancy in all phonon frequencies at the zone boundary
                </td>
              </tr>
              <tr>
                <td>▼</td>
                <td>
                  δV<sub>press</sub>
                </td>
                <td>%</td>
                <td>Discrepancy in pressure</td>
              </tr>
              <tr>
                <td>★</td>
                <td>
                  δE<sub>coh</sub>
                </td>
                <td>meV</td>
                <td>Discrepancy in cohesive energy</td>
              </tr>
              <tr>
                <td>■</td>
                <td>δν</td>
                <td>-</td>
                <td>Discrepancy in equation of state</td>
              </tr>
            </tbody>
          </Table>
          <p>
            A single click on a legend item toggles its visibility, while a
            double click isolates it.
          </p>
        </section>
        <section>
          <h5>Categories</h5>
          <p>
            You can use the pseudopotential category checkboxes to filter the
            pseudopotentials shown in the plots.
          </p>
        </section>
        <section>
          <h5>Additional information</h5>
          <p>
            See the <b>About</b> tab of the{" "}
            <a
              href="https://acwf-verification.materialscloud.org/"
              target="_blank"
              style={{ textDecoration: "none" }}
            >
              Verification of the precision of DFT implementations via AiiDA
              common workflows
            </a>{" "}
            app to learn more about how <b>ν</b> is computed. <br />
            All calculations are performed on the ground-state elemental solids
            unless stated otherwise (i.e. rare-earths and flourine). See{" "}
            <Link to="/about" style={{ textDecoration: "none" }}>
              About SSSP
            </Link>{" "}
            for more details.
          </p>
        </section>
      </Accordion.Body>
    </Accordion.Item>
  </Accordion>
);

export default ConvergencePlotDetails;
