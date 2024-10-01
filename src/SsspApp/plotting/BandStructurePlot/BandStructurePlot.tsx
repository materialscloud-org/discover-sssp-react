import { useEffect, useState } from "react";
import { Col, FormCheck, Row, Spinner } from "react-bootstrap";
import Plot from "react-plotly.js";

import { BandsPlotData } from "@sssp/models";
import SsspDataService from "@sssp/services/data";

import { BandStructurePlotProps } from "./BandStructurePlot.models";
import styles from "./BandStructurePlot.module.scss";

const colorPalette = [
  "black",
  "#27AE60", // Dark Green
  "#E74C3C", // Dark Red
  "#8E44AD", // Dark Purple
  "#F39C12", // Dark Orange
  "#2980B9", // Medium Blue
  "#D35400", // Medium Orange
  "#C0392B", // Medium Red
  "#16A085", // Dark Teal
  "#C71585", // Dark Pink
  "#7D3C98", // Dark Violet
  "#D68910", // Dark Gold
  "#AAB7B8", // Dark Gray
  "#2E4053", // Dark Charcoal
  "#F1948A", // Light Dark Pink
  "#2C3E50", // Dark Blue
];

const hoverDigits = 2;
const hoverTemplate = `(%{x:.${hoverDigits}f}, %{y:.${hoverDigits}f})`;

const BandStructurePlot: React.FC<BandStructurePlotProps> = ({
  element,
  activeAccuracy,
}) => {
  const [bandsData, setBandsData] = useState<BandsPlotData | undefined>();
  const [activePseudos, setActivePseudos] = useState<string[]>(["REF"]);
  const [pseudos, setPseudos] = useState<string[]>([]);
  const [pseudoColorMap, setPseudoColorMap] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    if (!element) return;
    const dataService = new SsspDataService(activeAccuracy);
    const data = dataService.fetchBandsData(element);
    setBandsData(data);
    const pseudos = Object.keys(data);
    setPseudos(pseudos);
    setPseudoColorMap(
      pseudos.reduce((acc: { [key: string]: string }, pseudo, i) => {
        acc[pseudo] = colorPalette[i % colorPalette.length];
        return acc;
      }, {})
    );
  }, [activeAccuracy, element]);

  if (!bandsData) {
    return (
      <div className="loading">
        Loading
        <Spinner className="spinner" animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div id="bands-plots">
      <Row>
        <Col md={4} lg={3} xxl={2} className={styles["pseudo-controls"]}>
          <FormCheck
            type="checkbox"
            id="all"
            label="Select all"
            defaultChecked={false}
            className={styles["pseudo-checkbox"]}
            style={{ color: "black" }}
            onChange={(event) => {
              if (!event.target.checked) {
                setActivePseudos(["REF"]);
              } else {
                setActivePseudos(pseudos);
              }
            }}
          />
          {pseudos.map((pseudo) => (
            <FormCheck
              key={pseudo}
              type="checkbox"
              id={pseudo}
              label={pseudo}
              checked={activePseudos.includes(pseudo)}
              disabled={pseudo === "REF"}
              className={styles["pseudo-checkbox"]}
              style={{ color: pseudoColorMap[pseudo] }}
              onChange={(event) => {
                if (!event.target.checked) {
                  setActivePseudos(activePseudos.filter((p) => p !== pseudo));
                } else {
                  setActivePseudos([...activePseudos, pseudo]);
                }
              }}
            />
          ))}
        </Col>
        <Col>
          <Row>
            {Object.entries(bandsData).map(([pseudo, data]) => {
              return (
                <Col key={pseudo}>
                  <Plot
                    data={data.paths[0].values[0].map((_, bandIndex) => {
                      const distances = data.paths.flatMap((path) => path.x);
                      const bands = data.paths.flatMap(
                        (path) => path.values[bandIndex]
                      );
                      return {
                        x: distances,
                        y: bands,
                        mode: "lines",
                        type: "scatter",
                        line: {
                          shape: "spline",
                          color: pseudoColorMap[pseudo],
                        },
                        name: `${pseudo} - Band ${bandIndex + 1}`,
                        hovertemplate: hoverTemplate,
                      };
                    })}
                    layout={{
                      xaxis: {
                        range: [0, 5],
                        showgrid: false,
                      },
                      yaxis: {
                        title: { text: "Dispersion [eV]", standoff: 20 },
                        showgrid: false,
                      },
                      showlegend: false,
                      margin: {
                        l: 70,
                        r: 20,
                        t: 30,
                        b: 60,
                      },
                      autosize: true,
                    }}
                    config={{
                      displaylogo: false,
                      modeBarButtonsToRemove: [
                        "zoomIn2d",
                        "zoomOut2d",
                        "autoScale2d",
                        "lasso2d",
                        "select2d",
                      ],
                    }}
                    style={{ width: "500px", height: "100%" }}
                    useResizeHandler={true}
                  />
                </Col>
              );
            })}
          </Row>
        </Col>
      </Row>
      <div id={styles["bands-note"]}>
        Electronic band structure along high-symmetry path. The reference energy
        (0 eV) corresponds to the Fermi level.
      </div>
    </div>
  );
};

export default BandStructurePlot;
