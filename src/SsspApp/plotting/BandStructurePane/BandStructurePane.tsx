import { useContext } from "react";
import { Col, Container, Row } from "react-bootstrap";

import { LoadingSpinner, NoDataMessage } from "@sssp/components";
import { PlotContext, PseudoContext } from "@sssp/context";

import BandStructureControls from "./BandStructureControls";
import styles from "./BandStructurePane.module.scss";
import BandStructurePlot from "./BandStructurePlot";

const BandStructurePane: React.FC = () => {
  const { loadingMetadata, pseudosMetadata } = useContext(PseudoContext);
  const {
    loadingBandsData,
    bandsPseudosMap,
    bandsPseudos,
    activeBandsPseudos,
    setActiveBandsPseudos,
    bandShift,
    setBandShift,
  } = useContext(PlotContext);

  const isLoading = loadingBandsData || loadingMetadata;

  const hasData = Object.keys(bandsPseudosMap || {}).length > 0;

  return isLoading ? (
    <LoadingSpinner />
  ) : !hasData ? (
    <NoDataMessage />
  ) : (
    <Container id="bands-plots">
      <Row>
        <Col lg="3">
          <BandStructureControls
            pseudos={bandsPseudos}
            activePseudos={activeBandsPseudos}
            bandShift={bandShift}
            onPseudoSelect={setActiveBandsPseudos}
            onBandShiftChange={setBandShift}
          />
        </Col>
        <Col lg="auto" className="ms-lg-5">
          <BandStructurePlot
            pseudosMetadata={pseudosMetadata}
            bandsPseudosMap={bandsPseudosMap}
            activePseudos={activeBandsPseudos}
            bandShift={bandShift}
          />
        </Col>
      </Row>
      <div id={styles["bands-note"]}>
        Electronic band structure along high-symmetry path. The reference energy
        (0 eV) corresponds to the Fermi level.
      </div>
    </Container>
  );
};

export default BandStructurePane;
