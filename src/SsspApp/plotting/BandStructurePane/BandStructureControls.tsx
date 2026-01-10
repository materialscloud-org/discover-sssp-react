import React from "react";
import { Col, Form, Row } from "react-bootstrap";

import PseudoSelector from "./PseudoSelector";

import BandStructureControlsProps from "./BandStructureControls.models";
import styles from "./BandStructureControls.module.scss";

const BandStructureControls: React.FC<BandStructureControlsProps> = ({
  pseudos,
  activePseudos,
  bandShift: pseudoShift,
  onPseudoSelect: setActivePseudos,
  onBandShiftChange: setPseudoShift,
}) => {
  return (
    <div id={styles["band-structure-controls"]}>
      <Row className="gap-3">
        <Col sm="6" lg="12">
          <PseudoSelector
            id={styles["reference-pseudo-selector"]}
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
            id={styles["compared-pseudo-selector"]}
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
        <Form.Label htmlFor={styles["pseudo-shift-range"]}>
          Compared bands shift (eV):
        </Form.Label>
        <Row style={{ alignItems: "center" }}>
          <Col xs="8" sm="9" md="10" lg="6" xl="7" xxl="8">
            <Form.Range
              id={styles["pseudo-shift-range"]}
              name="pseudo-shift-range"
              value={pseudoShift}
              min={-5}
              max={5}
              step={0.001}
              onChange={(e) => setPseudoShift(Number(e.target.value))}
            />
          </Col>
          <Col>
            <Form.Control
              name="pseudo-shift-number"
              type="number"
              value={pseudoShift}
              min={-5}
              max={5}
              step={0.001}
              onChange={(e) => setPseudoShift(Number(e.target.value))}
            />
          </Col>
        </Row>
      </Form.Group>
    </div>
  );
};

export default BandStructureControls;
