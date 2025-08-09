import { useEffect, useState } from "react";
import Plot from "react-plotly.js";

import { Annotations, Config, Data, Layout } from "plotly.js";

import LoadingSpinner from "@sssp/components/Spinner";
import SsspDataService from "@sssp/services/data";

import styles from "./OverviewPlot.module.scss";

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
    const dataService = new SsspDataService();
    dataService
      .fetchPseudosSummaryData(accuracy, element, convergence)
      .then((data) => {
        setConff(data.conff);
        setPseudos(data.pseudos.slice(0, 20));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setConff("");
        setPseudos([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [element, accuracy, convergence]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!conff || !pseudos.length) {
    return <p>No data available</p>;
  }

  const EOS_C_FACTOR = accuracy === "efficiency" ? 0.2 : 0.1;
  const PHONON_C_FACTOR = accuracy === "efficiency" ? 2 : 1;
  const PRESSURE_C_FACTOR = accuracy === "efficiency" ? 1 : 0.5;

  const traces: Partial<Data>[] = [];
  const annotations: Partial<Annotations>[] = [];

  const plotHeight = pseudos.length * 100 + 600;
  const offsetHeight = 8;
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
        (v) => (v * 2) / PHONON_C_FACTOR
      );
      const freqError = quantities.phonon_frequencies.error;
      traces.push({
        name: "δω",
        type: "scatter",
        mode: "lines+markers",
        line: { color: pseudo.color, width: lineWidth, dash: "solid" },
        marker: { size: markerSize, symbol: "circle" },
        showlegend: !hasLegend && showLegend,
        x: quantities.phonon_frequencies.cutoffs,
        y: frequencies.map((v) => v + offset),
        error_y: {
          type: "data",
          array: freqError,
          arrayminus: frequencies.map(() => 0),
          visible: true,
          color: pseudo.color,
        },
        customdata: frequencies.map((v, idx) => [v, freqError[idx]]),
        hovertemplate: `<b>${pseudo.name}<br>δω: %{customdata[0]:.1e} &plusmn; %{customdata[1]:.1e} cm<sup>-1</sup></b><extra></extra>`,
      });

      // ω_max annotation
      const omegaRef = quantities.phonon_frequencies.ref.toFixed(2);
      annotations.push({
        x: 203.1,
        y: offset - 1,
        text: `ω<sub>max</sub> = ${omegaRef} cm<sup>-1</sup>`,
        showarrow: false,
        font: { size: fontSize },
      });
    }

    if (quantities.pressure) {
      const pressure = quantities.pressure.values.map(
        (v) => (v * 2) / PRESSURE_C_FACTOR
      );
      traces.push({
        name: "δV<sub>press</sub>",
        type: "scatter",
        mode: "lines+markers",
        line: { color: pseudo.color, width: lineWidth, dash: "dash" },
        marker: { size: markerSize, symbol: "triangle-down" },
        showlegend: !hasLegend && showLegend,
        x: quantities.pressure.cutoffs,
        y: pressure.map((v) => v + offset),
        customdata: pressure,
        hovertemplate: `<b>${pseudo.name}<br>δV<sub>press</sub>: %{customdata:.2f}</b><extra></extra>`,
      });
    }

    if (quantities.cohesive_energy) {
      const cohesiveEnergy = quantities.cohesive_energy.values;
      traces.push({
        name: "δE<sub>coh</sub>",
        type: "scatter",
        mode: "lines+markers",
        line: { color: pseudo.color, width: lineWidth, dash: "dot" },
        marker: { size: markerSize, symbol: "star" },
        showlegend: !hasLegend && showLegend,
        x: quantities.cohesive_energy.cutoffs,
        y: cohesiveEnergy.map((v) => v + offset),
        customdata: cohesiveEnergy,
        hovertemplate: `<b>${pseudo.name}<br>δE<sub>coh</sub>: %{customdata:.2f}</b><extra></extra>`,
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
      const eos = quantities.eos.values.map((v) => (v * 2) / EOS_C_FACTOR);
      traces.push({
        name: "δv",
        type: "scatter",
        mode: "lines+markers",
        line: { color: pseudo.color, width: lineWidth, dash: "dot" },
        marker: { size: markerSize, symbol: "square" },
        showlegend: !hasLegend && showLegend,
        x: quantities.eos.cutoffs,
        y: eos.map((v) => v + offset),
        customdata: eos,
        hovertemplate: `<b>${pseudo.name}<br>δv: %{customdata:.2f}</b><extra></extra>`,
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
      r: 160,
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
    <div id={styles["overview-plot"]}>
      <div id={styles["overview-plot-inner"]}>
        <Plot
          data={traces}
          layout={layout}
          config={config}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
};

export default OverviewPlot;
