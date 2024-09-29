import React from "react";
import { Card, Spinner } from "react-bootstrap";

import { PlotFactoryProps } from "./PlotFactory.models";

import BandsChessboardPlots from "./BandsChessboardPlots";
import OverviewPlots from "./OverviewPlots";
import styles from "./PlotFactory.module.scss";

const PlotFactory: React.FC<PlotFactoryProps> = ({
  element,
  elementData,
  activeAccuracy,
  type,
}) => {
  if (!elementData) {
    return (
      <Card.Body id="plot-card">
        <div id={styles["loading"]}>
          Loading
          <Spinner id={styles["spinner"]} animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      </Card.Body>
    );
  }

  let plot = null;
  switch (type) {
    case "Overview":
      plot = (
        <OverviewPlots
          element={element}
          elementData={elementData}
          activeAccuracy={activeAccuracy}
        />
      );
      break;
    case "Bands Chessboards":
      plot = (
        <BandsChessboardPlots element={element} elementData={elementData} />
      );
      break;
    default:
      console.error(`Invalid plot type: ${type}`);
  }

  return <Card.Body id="plot-card">{plot}</Card.Body>;
};

export default PlotFactory;
