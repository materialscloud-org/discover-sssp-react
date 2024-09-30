import { useEffect, useState } from "react";
import { Col, FormCheck, Row, Spinner } from "react-bootstrap";
import Plot from "react-plotly.js";

import { EquationOfStatePlotsData } from "@sssp/models";
import SsspDataService from "@sssp/services/data";

import { EquationOfStatePlotsProps } from "./EquationOfStatePlots.models";
import styles from "./EquationOfStatePlots.module.scss";

const refRes = 1000; // resolution of reference equation of state

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

const EquationOfStatePlots: React.FC<EquationOfStatePlotsProps> = ({
  element,
  activeAccuracy,
}) => {
  const [eosData, setEosData] = useState<
    EquationOfStatePlotsData | undefined
  >();
  const [activePseudos, setActivePseudos] = useState<string[]>(["REF"]);
  const [pseudos, setPseudos] = useState<string[]>([]);
  const [pseudoColorMap, setPseudoColorMap] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    if (!element) return;
    const dataService = new SsspDataService(activeAccuracy);
    const data = dataService.fetchEosData(element);
    setEosData(data);
    const pseudos = Object.keys(Object.values(data)[0]);
    setPseudos(pseudos);
    setPseudoColorMap(
      pseudos.reduce((acc: { [key: string]: string }, pseudo, i) => {
        acc[pseudo] = colorPalette[i % colorPalette.length];
        return acc;
      }, {})
    );
  }, [activeAccuracy, element]);

  const BM = (V: number[], V0: number, E0: number, B0: number, B1: number) =>
    V.map((v) => {
      const eta = Math.pow(v / V0, 2 / 3);
      return (
        E0 +
        ((9 * B0 * V0) / 16) *
          (Math.pow(eta - 1, 3) * B1 + Math.pow(eta - 1, 2) * (6 - 4 * eta))
      );
    });

  if (!eosData) {
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
    <div id="eos-plots">
      <Row>
        <Col md={4} lg={3} xxl={2} id={styles["pseudo-controls"]}>
          {pseudos.map((pseudo) => (
            <FormCheck
              key={pseudo}
              type="checkbox"
              id={pseudo}
              label={pseudo}
              defaultChecked={pseudo === "REF"}
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
            {Object.entries(eosData).map(([configuration, pseudos]) => {
              const volumes = Object.values(pseudos).flatMap(
                (pseudo) => pseudo.volumes || []
              );
              const minVolume = Math.min(...volumes);
              const maxVolume = Math.max(...volumes);
              return (
                <Col lg={6} xl={4} xxl={3} key={configuration}>
                  <Plot
                    data={Object.entries(pseudos)
                      .filter(([pseudo]) => activePseudos.includes(pseudo))
                      .map(([pseudo, data]) => {
                        if (pseudo !== "REF" && data.volumes && data.energies) {
                          // TODO proper sorting should be done in the backend
                          if (data.volumes.length !== data.energies.length) {
                            console.error(
                              `Mismatch in volumes and energies for ${element} ${configuration} ${pseudo}`
                            );
                            return {};
                          }
                          const sorted = data.volumes
                            .map((volume, index) => ({
                              volume,
                              energy:
                                (data.energies?.[index] || 0.0) -
                                (data?.E0 || 0.0),
                            }))
                            .sort((a, b) => a.volume - b.volume);
                          const volumes = sorted.map((point) => point.volume);
                          const energies = sorted.map((point) => point.energy);
                          // TODO remove the above block once the backend is fixed
                          return {
                            x: volumes,
                            y: energies,
                            mode: "lines+markers",
                            type: "scatter",
                            line: { shape: "spline" },
                            name: pseudo,
                            marker: { color: pseudoColorMap[pseudo] },
                            hovertemplate: hoverTemplate,
                          };
                        } else {
                          const volumes = Array.from(
                            { length: refRes },
                            (_, i) =>
                              minVolume +
                              (i * (maxVolume - minVolume)) / (refRes - 1)
                          );
                          return {
                            x: volumes,
                            y: BM(volumes, data.V0, 0, data.B0, data.B1),
                            mode: "lines",
                            type: "scatter",
                            line: { color: pseudoColorMap[pseudo] },
                            name: pseudo,
                            hovertemplate: hoverTemplate,
                          };
                        }
                      })}
                    layout={{
                      title: configuration,
                      xaxis: {
                        title: { text: "Volume [Å³/atoms]", standoff: 20 },
                        showgrid: false,
                      },
                      yaxis: {
                        title: { text: "Energy [eV/atom]", standoff: 20 },
                        showgrid: false,
                      },
                      showlegend: false,
                      margin: {
                        l: 70,
                        r: 20,
                        t: 60,
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
                    style={{ width: "100%", height: "300px" }}
                    useResizeHandler={true}
                  />
                </Col>
              );
            })}
          </Row>
        </Col>
      </Row>
      <div id={styles["eos-note"]}>
        Comparison of the Birch-Murnaghan fit of the pseudopotential equation of
        state ("Fit") with the reference all-electron results ("Wien2k").
      </div>
    </div>
  );
};

export default EquationOfStatePlots;
