import { useEffect, useState } from "react";
import { Card, Tab, Tabs } from "react-bootstrap";
import Plot from "react-plotly.js";
import { Link } from "react-router-dom";

import { ElementDataResponse } from "@sssp/services/models";

import { Annotations, Config, Data, Layout } from "plotly.js";
import { OverviewPlotsProps } from "./OverviewPlots.models";
import styles from "./OverviewPlots.module.scss";

import { IMAGE_DATA_BASE_URL } from "../../../common/config";

const OverviewPlots: React.FC<OverviewPlotsProps> = ({
  element,
  elementData,
  activeAccuracy,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const key = `${activeAccuracy}_filenames` as keyof ElementDataResponse;
  const filenames = (elementData[key] || []) as string[];

  if (filenames) {
    filenames.sort((a, b) => {
      const aConvergence = a.split("_")[1];
      const bConvergence = b.split("_")[1];
      return parseFloat(aConvergence) - parseFloat(bConvergence);
    });
  }

  return (
    <div id="overview-plots">
      <div id="convergence-panels">
        <Tabs
          activeKey={activeTab}
          onSelect={(tabIndex) => setActiveTab(parseInt(tabIndex || "0"))}
        >
          {filenames.map((filename, index) => {
            const convergence = filename.split("_")[1];
            const title = `Convergence ${activeAccuracy} - ${convergence}`;
            return (
              <Tab eventKey={index} title={title} key={index}>
                <Card.Body className="overview-card">
                  <OverviewPlot
                    element={element}
                    accuracy={activeAccuracy}
                    convergence={convergence}
                  />
                </Card.Body>
              </Tab>
            );
          })}
        </Tabs>
      </div>
      <div id={styles["overview-note"]}>
        Convergence pattern plots according to the SSSP protocol: zone-boundary
        phonons, cohesive energy, pressure and band structure versus the
        wavefunction cutoff for all the considered pseudopotential libraries
        (the horizontal dashed lines correspond to the thresholds of the SSSP
        selection criteria). On the right-hand side we report the number of
        valence electrons of the pseudopotential, the delta-factor with respect
        to the reference all-electron results and the maximum phonon frequency.
        All calculations are performed on the ground-state elemental solids
        unless stated otherwise (i.e. rare-earths and flourine). The circle
        marks the pseudopotential and wavefunction cutoff chosen for the SSSP
        library (see <Link to="/about">About SSSP</Link> for more details).
      </div>
    </div>
  );
};

interface OverviewPlotProps {
  element: string;
  accuracy: string;
  convergence: string;
}

interface PseudoResponse {
  conff: string;
  pseudos: Pseudo[];
}

interface PseudoQuantity {
  cutoffs: number[];
  values: number[];
}

interface Pseudo {
  conff: string;
  name: string;
  color: string;
  Z: number;
  quantities: {
    metadata?: {
      avg_nu: number;
      max_nu: number;
      ang_nu: number;
      max_conf: string;
    };
    phonon_frequencies?: PseudoQuantity & { error: number[]; ref: number };
    pressure?: PseudoQuantity;
    cohesive_energy?: PseudoQuantity & { ref: number };
    eos?: PseudoQuantity;
    bands?: {
      cutoffs: number[];
      eta_c: number[];
      max_diff_c: number[];
    };
  };
}

const HIGH_DUAL_ELEMENTS = new Set(["O", "Fe", "Mn", "Hf", "Co", "Ni", "Cr"]);

const OverviewPlot: React.FC<OverviewPlotProps> = ({
  element,
  accuracy,
  convergence,
}) => {
  const [loading, setLoading] = useState(true);
  const [conff, setConff] = useState("");
  const [pseudos, setPseudos] = useState<Pseudo[]>([]);

  useEffect(() => {
    const source = `${IMAGE_DATA_BASE_URL}/summary/${element}_${convergence}.json`;
    fetch(source)
      .then((res) => res.json())
      .then((data: PseudoResponse) => {
        setConff(data.conff);
        setPseudos(data.pseudos.slice(0, 20));
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, [element, accuracy, convergence]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const EOS_C_FACTOR = accuracy === "efficiency" ? 0.2 : 0.1;
  const PHONON_C_FACTOR = accuracy === "efficiency" ? 2 : 1;
  const PRESSURE_C_FACTOR = accuracy === "efficiency" ? 1 : 0.5;

  const traces: Partial<Data>[] = [];
  const annotations: Partial<Annotations>[] = [];

  const plotHeight = pseudos.length * 100 + 600;
  const offsetHeight = 8; // 8
  const windowHeight = offsetHeight / 4;
  const aboveScalar = 1.2;
  const belowScalar = 1.3;
  const annotationOffset = 0.005;
  const markerSize = 6;
  const lineWidth = 1;
  const fontSize = 10;

  const offsetsArray = pseudos.map((_, i) => i * offsetHeight);

  const dual = HIGH_DUAL_ELEMENTS.has(element) ? 18 : 8;

  let hasLegend = false;

  pseudos.forEach((pseudo, i) => {
    const offset = i * offsetHeight;
    const showLegend = pseudo.color == "#000000";

    const { quantities } = pseudo;

    if (quantities.phonon_frequencies) {
      const frequencies = quantities.phonon_frequencies.values.map(
        (v) => (v * 2) / PHONON_C_FACTOR + offset
      );
      traces.push({
        name: "δω",
        type: "scatter",
        mode: "lines+markers",
        line: { color: pseudo.color, width: lineWidth, dash: "solid" },
        marker: { size: markerSize, symbol: "circle" },
        hovertemplate: `<b>${pseudo.name} | δω: %{y:.2f}</b><extra></extra>`,
        showlegend: !hasLegend && showLegend,
        x: quantities.phonon_frequencies.cutoffs,
        y: frequencies,
        error_y: {
          type: "data",
          array: quantities.phonon_frequencies.error,
          arrayminus: frequencies.map(() => 0),
          visible: true,
          color: pseudo.color,
        },
      });

      // ω_max annotation
      const omegaRef = quantities.phonon_frequencies.ref.toFixed(2);
      annotations.push({
        x: 205,
        y: offset - 1,
        text: `ω<sub>max</sub> = ${omegaRef} cm<sup>-1</sup>`,
        showarrow: false,
        font: { size: fontSize },
      });
    }

    if (quantities.pressure) {
      traces.push({
        name: "δV<sub>press</sub>",
        type: "scatter",
        mode: "lines+markers",
        line: { color: pseudo.color, width: lineWidth, dash: "dash" },
        marker: { size: markerSize, symbol: "triangle-down" },
        hovertemplate: `<b>${pseudo.name} | δV<sub>press</sub>: %{y:.2f}</b><extra></extra>`,
        showlegend: !hasLegend && showLegend,
        x: quantities.pressure.cutoffs,
        y: quantities.pressure.values.map(
          (v) => (v * 2) / PRESSURE_C_FACTOR + offset
        ),
      });
    }

    if (quantities.cohesive_energy) {
      traces.push({
        name: "δE<sub>coh</sub>",
        type: "scatter",
        mode: "lines+markers",
        line: { color: pseudo.color, width: lineWidth, dash: "dot" },
        marker: { size: markerSize, symbol: "star" },
        hovertemplate: `<b>${pseudo.name} | δE<sub>coh</sub>: %{y:.2f}</b><extra></extra>`,
        showlegend: !hasLegend && showLegend,
        x: quantities.cohesive_energy.cutoffs,
        y: quantities.cohesive_energy.values.map((v) => v + offset),
      });

      // E_cohesive ref
      const cohesiveRef = quantities.cohesive_energy.ref.toFixed(2);
      annotations.push({
        x: 205,
        y: offset + 1,
        text: `E<sub>coh</sub> = ${cohesiveRef} <i>meV/atom</i>`,
        showarrow: false,
        font: { size: fontSize },
      });
    }

    if (quantities.eos) {
      traces.push({
        name: "δv",
        type: "scatter",
        mode: "lines+markers",
        line: { color: pseudo.color, width: lineWidth, dash: "dot" },
        marker: { size: markerSize, symbol: "square" },
        hovertemplate: `<b>${pseudo.name} | δv: %{y:.2f}</b><extra></extra>`,
        showlegend: !hasLegend && showLegend,
        x: quantities.eos.cutoffs,
        y: quantities.eos.values.map((v) => (v * 2) / EOS_C_FACTOR + offset),
      });
    }

    if (quantities.bands) {
      const x = quantities.bands.cutoffs;
      const eta_c: number[] = quantities.bands.eta_c;
      const max_diff_c: number[] = quantities.bands.max_diff_c;

      // Above BS values
      // Label
      annotations.push({
        x: 24,
        y: offset + aboveScalar * windowHeight + annotationOffset,
        text: "       <i>η</i><sub>10</sub> = ",
        showarrow: false,
        align: "left",
        font: { size: fontSize },
      });
      // Text
      traces.push({
        x: x,
        y: eta_c.map(() => offset + aboveScalar * windowHeight),
        type: "scatter",
        mode: "text",
        text: eta_c.map((v) => v.toFixed(2)),
        showlegend: false,
        textfont: { size: fontSize },
        hoverinfo: "skip",
      });
      // Units
      annotations.push({
        x: 205,
        y: offset + aboveScalar * windowHeight + annotationOffset,
        text: "[meV]",
        showarrow: false,
        align: "left",
        font: { size: fontSize },
      });
      // Line
      traces.push({
        x: [0, 250],
        y: [offset + windowHeight, offset + windowHeight],
        type: "scatter",
        mode: "lines",
        text: eta_c.map((v) => v.toFixed(2)),
        showlegend: false,
        line: { color: pseudo.color, width: lineWidth, dash: "dashdot" },
        hoverinfo: "skip",
      });

      // Below BS values
      // Label
      annotations.push({
        x: 24,
        y: offset - belowScalar * windowHeight + annotationOffset,
        text: "max <i>η</i><sub>10</sub> = ",
        showarrow: false,
        align: "left",
        font: { size: fontSize },
      });
      // Text
      traces.push({
        x: x,
        y: max_diff_c.map(() => offset - belowScalar * windowHeight),
        type: "scatter",
        mode: "text",
        text: max_diff_c.map((v) => v.toFixed(2)),
        showlegend: false,
        textfont: { size: fontSize },
        hoverinfo: "skip",
      });
      // Units
      annotations.push({
        x: 205,
        y: offset - belowScalar * windowHeight + annotationOffset,
        text: "[meV]",
        showarrow: false,
        align: "left",
        font: { size: fontSize },
      });
      // Line
      traces.push({
        x: [0, 250],
        y: [offset - windowHeight, offset - windowHeight],
        type: "scatter",
        mode: "lines",
        text: max_diff_c.map((v) => v.toFixed(2)),
        showlegend: false,
        line: { color: pseudo.color, width: lineWidth, dash: "dashdot" },
        hoverinfo: "skip",
      });

      hasLegend = hasLegend || showLegend;
    }

    // Pseudo metadata annotation
    const { metadata } = pseudo.quantities;
    const metadataText = metadata
      ? `avg.v = ${metadata.avg_nu.toFixed(
          2
        )}<br>max.v = ${metadata.max_nu.toFixed(2)} (${
          metadata.max_conf
        })<br>ang.v = ${metadata.ang_nu.toFixed(2)} (w/o XO3)`
      : "not all EOS valid";
    annotations.push({
      xref: "paper",
      x: metadata ? 1.1 : 1.085,
      y: offset,
      text: `${pseudo.name}<br>Z = ${pseudo.Z}<br>${metadataText}`,
      showarrow: false,
      align: "center",
      font: { size: 10 },
    });
  });

  const layout: Partial<Layout> = {
    title: `Verification summary: ${element} (${conff}) (${accuracy})`,
    xaxis: {
      title: `Wavefunction cutoff [Ry]; Charge density cutoff [Ry] = ${dual} x Ewfc (PAW/US) | 4 x Ewfc (NC); q-point = [0.5, 0.5, 0.5]`,
      showgrid: false,
      showline: true,
      mirror: true,
      tickvals: [...Array.from({ length: 18 }, (_, i) => i * 10 + 30)],
      ticks: "inside",
      ticklen: 5,
      range: [18, 216],
      fixedrange: true,
    },
    yaxis: {
      title: `Error w.r.t. ref. wavefunction cutoff (for the SSSP ${accuracy} criteria)`,
      zeroline: false,
      showgrid: false,
      showline: true,
      mirror: true,
      ticks: "inside",
      ticklen: 5,
      tickmode: "array",
      tickvals: offsetsArray,
      ticktext: offsetsArray.map(() => "0"),
    },
    showlegend: true,
    legend: {
      x: -0.07,
      y: 1,
      xanchor: "left",
      yanchor: "top",
      font: { size: fontSize, color: "black" },
      bordercolor: "lightgrey",
      borderwidth: 1,
    },
    annotations: annotations,
    hovermode: "closest",
    height: plotHeight,
    margin: {
      l: 100,
      r: 150,
      t: 40,
      b: 80,
    },
  };

  const config: Partial<Config> = {
    responsive: true,
    displayModeBar: false,
    displaylogo: false,
  };

  return (
    <Plot
      data={traces}
      layout={layout}
      config={config}
      style={{ width: "100%" }}
    />
  );
};

export default OverviewPlots;
