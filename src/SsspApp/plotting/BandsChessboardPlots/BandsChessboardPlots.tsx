import { Col, Row } from "react-bootstrap";
import BandsChessboardPlot from "./BandsChessboardPlot";
import BandsChessboardPlotsProps from "./BandsChessboardPlots.models";
import styles from "./BandsChessboardPlots.module.scss";

const pseudos = [
  "031US",
  "031PAW",
  "100US",
  "100PAW",
  "GBRV-1.2",
  "SG15",
  "SG15-1.1",
];

const eta_v = [
  [0, 1.1, 0.5, 1.0, 0.9, 2.8, 3.2],
  [1.6, 0, 1.0, 0.5, 1.5, 2.2, 2.4],
  [1.7, 3.1, 0, 0.7, 0.8, 2.5, 2.9],
  [1.7, 2.2, 0.9, 0, 1.2, 2.0, 2.4],
  [2.5, 3.9, 2.5, 2.9, 0, 2.5, 3.1],
  [7.5, 7.3, 7.4, 7.2, 6.1, 0, 0.7],
  [7.1, 7.0, 7.1, 6.8, 6.9, 1.4, 0],
];

const eta_10 = [
  [0, 1.1, 2.6, 2.8, 2.0, 16.7, 17.9],
  [3.0, 0, 2.4, 2.7, 2.2, 17.5, 18.7],
  [14.4, 14.3, 0, 0.8, 1.3, 17.8, 18.9],
  [15.4, 15.4, 3.5, 0, 1.4, 17.2, 18.4],
  [13.2, 13.1, 5.9, 6.8, 0, 17.0, 18.2],
  [54.7, 56.0, 52.6, 49.1, 47.9, 0, 1.3],
  [58.3, 59.6, 56.2, 52.7, 51.6, 3.6, 0],
];

const BandsChessboardPlots: React.FC<BandsChessboardPlotsProps> = ({
  element,
  activeLibrary,
}) => {
  return (
    <div id="chessboard-plots">
      <Row>
        <Col md={12} lg={6}>
          <BandsChessboardPlot
            element={element}
            pseudos={pseudos}
            values={eta_v}
            title="V"
            colorMax={Math.max(...eta_v.flat())}
          />
        </Col>
        <Col md={12} lg={6}>
          <BandsChessboardPlot
            element={element}
            pseudos={pseudos}
            values={eta_10}
            title="10"
            colorMax={Math.max(...eta_10.flat())}
          />
        </Col>
      </Row>
    </div>
  );
};

export default BandsChessboardPlots;
