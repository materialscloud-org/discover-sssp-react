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

const GREEK: { [key: string]: string } = {
  GAMMA: "Γ",
  SIGMA: "Σ",
};

const BandStructurePlot: React.FC<BandStructurePlotProps> = ({
  element,
  activeAccuracy,
}) => {
  const [bandsData, setBandsData] = useState<BandsPlotData | undefined>();
  const [highSymPath, setHighSymPath] = useState<string[][]>([]);
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
    setHighSymPath(
      data?.[Object.keys(data)[0]].paths.map((segment) => [
        GREEK?.[segment.from] || segment.from,
        GREEK?.[segment.to] || segment.to,
      ])
    );
    const pseudos = data && Object.keys(data);
    setPseudos(pseudos);
    setPseudoColorMap(
      pseudos?.reduce((acc: { [key: string]: string }, pseudo, i) => {
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
              const maxDistance = Math.max(
                ...data.paths.map((path) => path.x[path.x.length - 1])
              );

              const tickData = data.paths.flatMap((path, pathIndex, array) => {
                const { from, to } = path;
                let values: number[] = [];
                let text: string[] = [];

                if (pathIndex === 0) {
                  values = [path.x[0]];
                  text = [from];
                } else if (array[pathIndex - 1].to === from) {
                  if (path.length === 1) {
                    values = [path.x[0]];
                    text = [`${from}|${to}`];
                  } else if (array[pathIndex - 1].length === 1) {
                    values = [];
                    text = [];
                  } else if (pathIndex === array.length - 1) {
                    values = [path.x[0], path.x[path.x.length - 1]];
                    text = [from, to];
                  } else {
                    values = [path.x[0]];
                    text = [from];
                  }
                } else {
                  values = [path.x[0], path.x[path.x.length - 1]];
                  text = [from, to];
                }

                return {
                  values,
                  text: text.map((tick) => GREEK?.[tick] || tick),
                };
              });

              const tickVals = tickData.flatMap((td) => td.values);
              const tickText = tickData.flatMap((td) => td.text);

              return (
                <Col key={pseudo}>
                  <Plot
                    data={data.paths.flatMap((path, pathIndex) => {
                      return path.values.map((band, bandIndex) => ({
                        x: path.x,
                        y: band.map((e) => e - data.fermi_level),
                        type: "scatter",
                        mode: "lines",
                        name: pseudo,
                        hovertemplate: `${
                          highSymPath[pathIndex]?.join("-") || ""
                        } | band ${bandIndex}`,
                        line: {
                          color: pseudoColorMap[pseudo],
                          width: 1.5,
                        },
                      }));
                    })}
                    layout={{
                      xaxis: {
                        range: [0, maxDistance],
                        showgrid: false,
                        tickmode: "array",
                        tickvals: tickVals,
                        ticktext: tickText,
                      },
                      yaxis: {
                        title: { text: "Dispersion [eV]", standoff: 10 },
                        ticklen: 5,
                        showgrid: false,
                      },
                      shapes: [
                        ...(tickVals
                          .slice(1, tickVals.length - 1)
                          .map((xValue) => ({
                            type: "line",
                            x0: xValue,
                            x1: xValue,
                            y0: 0,
                            y1: 1,
                            xref: "x",
                            yref: "paper",
                            line: {
                              width: 1,
                              color: "gray",
                            },
                          })) as Partial<Plotly.Shape>[]),
                        {
                          type: "rect",
                          xref: "paper",
                          yref: "paper",
                          x0: 0,
                          x1: 1,
                          y0: 0,
                          y1: 1,
                          line: {
                            color: "black",
                            width: 2,
                          },
                        },
                      ],
                      showlegend: false,
                      margin: {
                        l: 70,
                        r: 10,
                        t: 30,
                        b: 20,
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
                    style={{
                      width: "500px",
                      height: "100%",
                    }}
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
