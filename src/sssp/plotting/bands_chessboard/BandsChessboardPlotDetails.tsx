import { Accordion } from "react-bootstrap";

const BandsChessboardPlotDetails: React.FC = () => (
  <Accordion>
    <Accordion.Item eventKey="0">
      <Accordion.Header>About the SSSP bands chessboard plots</Accordion.Header>
      <Accordion.Body>
        <section>
          <p>
            The band chessboard plots report the average and maximum distances
            between bands computed with the pseudopotentials considered in the
            SSSP study for the selected element. The quantities are computed by
            considering all bands up to the Fermi level (
            <b>
              η<sub>v</sub>
            </b>
            ), as well as 10 eV above it (
            <b>
              η<sub>10</sub>
            </b>
            ).
          </p>
          <p>
            In each plot, the average band distance between two pseudopotentials
            is given in the{" "}
            <span style={{ color: "purple" }}>
              <b>upper right triangle</b>
            </span>
            , while the maximum band distance is given in the{" "}
            <span style={{ color: "blue" }}>
              <b>lower left triangle</b>
            </span>
            .
          </p>
          <p>
            Clicking on a plot tile will redirect you to the{" "}
            <b>Band Structure</b> panel, where you can compare the band
            structures computed with the y-axis pseudopotential (
            <span style={{ color: "red" }}>
              <b>compared</b>
            </span>
            ) against the x-axis pseudopotential (<b>reference</b>).
          </p>
        </section>
      </Accordion.Body>
    </Accordion.Item>
  </Accordion>
);

export default BandsChessboardPlotDetails;
