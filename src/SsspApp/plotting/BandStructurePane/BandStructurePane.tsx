import { useContext, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

import { LoadingSpinner, NoDataMessage } from "@sssp/components";
import { PseudosContext } from "@sssp/context";
import { BandsPseudosMap } from "@sssp/models";
import { SsspDataService } from "@sssp/services";

import BandStructureControls from "./BandStructureControls";
import BandStructurePaneProps from "./BandStructurePane.models";
import styles from "./BandStructurePane.module.scss";
import BandStructurePlot from "./BandStructurePlot";

const BandStructurePane: React.FC<BandStructurePaneProps> = ({
  element,
  chessboardPseudos,
  bandShift: chessboardBandShift,
}) => {
  const { loadingMetadata, pseudosMetadata } = useContext(PseudosContext);
  const [loadingData, setLoadingData] = useState(true);
  const [bandsPseudosMap, setBandsPseudosMap] = useState({} as BandsPseudosMap);
  const [pseudos, setPseudos] = useState([] as string[]);
  const [activePseudos, setActivePseudos] = useState(chessboardPseudos);
  const [bandShift, setBandShift] = useState(chessboardBandShift);

  useEffect(() => {
    if (!element) return;

    setLoadingData(true);
    setBandsPseudosMap({} as BandsPseudosMap);
    setPseudos([]);
    setBandShift(0);

    SsspDataService.fetchBandsData(element)
      .then((data) => {
        setBandsPseudosMap(data);
        const pseudos = data && Object.keys(data);
        setPseudos(pseudos);
      })
      .catch((error) => {
        console.error("Error fetching bands data:", error);
        setBandsPseudosMap({} as BandsPseudosMap);
        setPseudos([]);
      })
      .finally(() => {
        setLoadingData(false);
      });
  }, [element]);

  useEffect(() => {
    const isValidPair = (pair: string[]) =>
      pair.length === 2 && pair.every((p) => pseudos.includes(p));

    if (!pseudos.length) {
      setActivePseudos([]);
      return;
    }

    setActivePseudos((prev) => {
      if (isValidPair(chessboardPseudos)) return chessboardPseudos;
      if (isValidPair(prev)) return prev;
      return [pseudos[0], pseudos[0]];
    });
  }, [pseudos, chessboardPseudos, element]);

  useEffect(() => setBandShift(bandShift), [bandShift]);

  const isLoading = loadingData || loadingMetadata;

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
            pseudos={pseudos}
            activePseudos={activePseudos}
            bandShift={bandShift}
            onPseudoSelect={setActivePseudos}
            onBandShiftChange={setBandShift}
          />
        </Col>
        <Col lg="auto" className="ms-lg-5">
          <BandStructurePlot
            pseudosMetadata={pseudosMetadata}
            bandsPseudosMap={bandsPseudosMap}
            activePseudos={activePseudos}
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
