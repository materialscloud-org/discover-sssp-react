import React from "react";
import { Col, Form, Row } from "react-bootstrap";

import PseudoSelector from "./PseudoSelector";

import BandStructureControlsProps from "./BandStructureControls.models";
import styles from "./BandStructureControls.module.scss";

const BandStructureControls: React.FC<BandStructureControlsProps> = ({
  pseudos,
  activePseudos,
  onPseudoSelect: setActivePseudos,
  bandShift: pseudoShift,
  onBandShiftChange: setPseudoShift,
}) => {
  return (
    <div id={styles.bandStructureControls}>
      <Row className="gap-3">
        <Col sm="6" lg="12">
          <PseudoSelector
            id={styles.referencePseudoSelector}
            which="reference"
            pseudos={pseudos}
            value={activePseudos[0]}
            onSelect={(pseudo) => {
              setActivePseudos([pseudo, activePseudos[1]]);
              setPseudoShift(0);
            }}
          />
        </Col>
        <Col>
          <PseudoSelector
            id={styles.comparedPseudoSelector}
            which="compared"
            pseudos={pseudos}
            value={activePseudos[1]}
            onSelect={(pseudo) => {
              setActivePseudos([activePseudos[0], pseudo]);
              setPseudoShift(0);
            }}
          />
        </Col>
      </Row>
      <Form.Group>
        <Form.Label htmlFor={styles.pseudoShiftRange}>
          Compared bands shift (meV):
        </Form.Label>
        <Row style={{ alignItems: "center" }}>
          <Col xs="8" sm="9" md="10" lg="6">
            <Form.Range
              id={styles.pseudoShiftRange}
              name={styles.pseudoShiftRange}
              value={pseudoShift}
              min={-5000}
              max={5000}
              step={1}
              onChange={(e) => setPseudoShift(Number(e.target.value))}
            />
          </Col>
          <Col>
            <Form.Control
              id={styles.pseudoShiftNumber}
              name={styles.pseudoShiftNumber}
              type="number"
              value={pseudoShift.toFixed(0)}
              min={-5000}
              max={5000}
              step={1}
              onChange={(e) => setPseudoShift(Number(e.target.value))}
            />
          </Col>
        </Row>
      </Form.Group>
    </div>
  );
};

export default BandStructureControls;
