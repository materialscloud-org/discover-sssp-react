import { useContext } from "react";
import { Col, Row } from "react-bootstrap";

import { LoadingSpinner, NoDataMessage } from "@sssp/components";
import { ElementContext, PlotContext, PseudoContext } from "@sssp/context";

import PlotPaneHeader from "../PlotPaneHeader";
import BandStructureControls from "./BandStructureControls";
import styles from "./BandStructurePane.module.scss";
import BandStructurePlot from "./BandStructurePlot";

const BandStructurePane: React.FC = () => {
  const { element } = useContext(ElementContext);
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
  ) : (
    <div id={styles.bandStructurePane}>
      <PlotPaneHeader title={`Band Structure: ${element}`} />
      {!hasData ? (
        <NoDataMessage />
      ) : (
        <div id={styles.bandStructureContent}>
          <Row className="justify-content-center">
            <Col lg={3}>
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
          <div id={styles.bandsNote}>
            Electronic band structure along high-symmetry path. The reference
            energy (0 eV) corresponds to the Fermi level.
          </div>
        </div>
      )}
    </div>
  );
};

export default BandStructurePane;
