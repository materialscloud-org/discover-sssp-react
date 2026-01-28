import { Accordion, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

import styles from "./ConvergencePlotDetails.module.scss";

const ConvergencePlotDetails: React.FC = () => (
  <Accordion>
    <Accordion.Item eventKey="0">
      <Accordion.Header>
        About the SSSP protocol convergence pattern plots
      </Accordion.Header>
      <Accordion.Body>
        <section>
          <p>
            We report here the zone-boundary phonons, cohesive energy, pressure,
            and band structure versus the wavefunction cutoff for all the
            considered pseudopotential libraries. The colored horizontal dashed
            lines correspond to the thresholds of the SSSP efficiency criteria,
            whereas the gray dotted lines correspond to the precision criteria.
            The recommended efficiency (precision) pseudopotential is marked
            with a <span style={{ color: "green" }}>rectangle</span> (
            <span style={{ color: "red" }}>diamond</span>) at the recommended
            cutoff.
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
          <h5>Metadata</h5>
          <p>We report on the left of the plot:</p>
          <Table id={styles.metadataTable} striped bordered responsive>
            <thead>
              <tr>
                <th>Quantity</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  Z<sub>val</sub>
                </td>
                <td>Number of valence electrons of the pseudopotential</td>
              </tr>
              <tr>
                <td>
                  ν<sub>avg</sub>
                </td>
                <td>
                  Average of <b>ν</b> across 10 configurations
                </td>
              </tr>
              <tr>
                <td>
                  ν<sub>max</sub> (#)
                </td>
                <td>
                  Maximum <b>ν</b> value across 10 configurations and the
                  corresponding configuration (#)
                </td>
              </tr>
              <tr>
                <td>
                  ν<sub>avg</sub> (w/o #)
                </td>
                <td>
                  Average of <b>ν</b>, excluding the configuration with the
                  largest discrepancy (#)
                </td>
              </tr>
            </tbody>
          </Table>
          <p>
            <em>
              Click on the metadata to open a UPF viewer to view/download the
              UPF file for the pseudopotential (requires an API backend).
            </em>
          </p>
        </section>
        <section>
          <h5>Legend</h5>
          <p>
            The legend reflects the corresponding quantity/discrepancy across
            all pseudopotentials:
          </p>
          <Table id={styles.legendTable} striped bordered responsive>
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
            <em>
              Click once on a legend item to toggle its visibility. Double-click
              to exclude all other items.
            </em>
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
            app to learn more about how <b>ν</b> is computed. All calculations
            are performed on the ground-state elemental solids unless stated
            otherwise (i.e. rare-earths and flourine). See{" "}
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
