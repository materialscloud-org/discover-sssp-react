import { Accordion } from "react-bootstrap";
import { Link } from "react-router-dom";

const BandsChessboardPlotDetails: React.FC = () => (
  <Accordion>
    <Accordion.Item eventKey="0">
      <Accordion.Header>About the SSSP bands chessboard plots</Accordion.Header>
      <Accordion.Body>
        <section>
          <p>
            The band chessboard plots report the average (top plot) and maximum
            (bottom plot) distances between bands computed with the
            pseudopotentials considered in the SSSP study for the selected
            element. The quantities are computed both on a Brillouin zone grid
            and on a k-path by considering bands above -10 eV up to the Fermi
            level (
            <b>
              η<sub>val</sub> -{" "}
              <span style={{ color: "blue" }}>lower triangle</span>
            </b>
            ) and 10 eV above it (
            <b>
              η<sub>10</sub> -{" "}
              <span style={{ color: "purple" }}>upper triangle</span>
            </b>
            ). For further details on the distance metrics, please see the{" "}
            <Link to="/about#bands-calculations">About</Link> page.
          </p>
          <p>
            Clicking on a plot tile will redirect you to the{" "}
            <b>Band Structure</b> panel, where you can compare the band
            structures computed with the x-axis pseudopotential (
            <span style={{ color: "red" }}>
              <b>compared</b>
            </span>
            ) against the y-axis pseudopotential (<b>reference</b>).
          </p>
        </section>
      </Accordion.Body>
    </Accordion.Item>
  </Accordion>
);

export default BandsChessboardPlotDetails;
