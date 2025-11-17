import type { Annotations, Data, Layout, Shape } from "plotly.js";

import { ElementInfo, PseudosMetadata } from "@sssp/models";

const aboveScalar = 1.2; // offset for annotations above the efficiency line
const belowScalar = 1.3; // offset for annotations below the efficiency line
const annotationOffset = 0.13; // offset for last point annotations

const markerSize = 6;
const lineWidth = 1;
const fontSize = 10;

const topMargin = 40;
const bottomMargin = 80;

const deltaX = 2; // highlight rectangle half-width

const offsetHeight = 8; // offset between pseudos
const PIXELS_PER_PSEUDO = 120; // fixed

const HIGH_DUAL_ELEMENTS = new Set(["O", "Fe", "Mn", "Hf", "Co", "Ni", "Cr"]);

const EOS_C_FACTOR = 0.2;
const PHONON_C_FACTOR = 2;
const PRESSURE_C_FACTOR = 1;

export const generateConvergencePlotData = (
  element: string,
  conff: string,
  libraries: string[],
  recommendedPseudos: { [key: string]: ElementInfo },
  activePseudos: Pseudo[],
  pseudosMetadata: PseudosMetadata
): {
  data: Partial<Data>[];
  layout: Partial<Layout>;
} => {
  const windowHeight = offsetHeight / 4;
  const offsetsArray = activePseudos.map((_, i) => i * offsetHeight);
  const plotHeight =
    activePseudos.length * PIXELS_PER_PSEUDO + (topMargin + bottomMargin);

  const dual = HIGH_DUAL_ELEMENTS.has(element) ? 18 : 8;

  const data: Partial<Data>[] = [];
  const annotations: Partial<Annotations>[] = [];
  const shapes: Partial<Shape>[] = [];

  activePseudos.forEach((pseudo, i) => {
    const color = pseudosMetadata[pseudo.name]?.color || "black";
    const offset = i * offsetHeight;

    const { quantities } = pseudo;

    if (quantities.phonon_frequencies) {
      const frequencies = quantities.phonon_frequencies.values.map(
        (v) => (v * 2) / PHONON_C_FACTOR
      );
      const freqError = quantities.phonon_frequencies.error;
      data.push({
        name: "δω",
        type: "scatter",
        mode: "lines+markers",
        line: { color: color, width: lineWidth, dash: "solid" },
        marker: { size: markerSize, symbol: "circle" },
        showlegend: false,
        x: quantities.phonon_frequencies.cutoffs,
        y: frequencies.map((v) => v + offset),
        error_y: {
          type: "data",
          array: freqError,
          arrayminus: frequencies.map(() => 0),
          visible: true,
          color: color,
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
      data.push({
        name: "δV<sub>press</sub>",
        type: "scatter",
        mode: "lines+markers",
        line: { color: color, width: lineWidth, dash: "dash" },
        marker: { size: markerSize, symbol: "triangle-down" },
        showlegend: false,
        x: quantities.pressure.cutoffs,
        y: pressure.map((v) => v + offset),
        customdata: pressure,
        hovertemplate: `<b>${pseudo.name}<br>δV<sub>press</sub>: %{customdata:.2f}</b><extra></extra>`,
      });
    }

    if (quantities.cohesive_energy) {
      const cohesiveEnergy = quantities.cohesive_energy.values;
      data.push({
        name: "δE<sub>coh</sub>",
        type: "scatter",
        mode: "lines+markers",
        line: { color: color, width: lineWidth, dash: "dot" },
        marker: { size: markerSize, symbol: "star" },
        showlegend: false,
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
      data.push({
        name: "δv",
        type: "scatter",
        mode: "lines+markers",
        line: { color: color, width: lineWidth, dash: "dot" },
        marker: { size: markerSize, symbol: "square" },
        showlegend: false,
        x: quantities.eos.cutoffs,
        y: eos.map((v) => v + offset),
        customdata: eos,
        hovertemplate: `<b>${pseudo.name}<br>δν: %{customdata:.2f}</b><extra></extra>`,
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
      data.push({
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
      // Efficiency line
      data.push({
        x: [0, 250],
        y: [offset + windowHeight, offset + windowHeight],
        type: "scatter",
        mode: "lines",
        text: eta_c.map((v) => v.toFixed(2)),
        showlegend: false,
        line: { color: color, width: lineWidth, dash: "dashdot" },
        hoverinfo: "skip",
      });
      // Precision line
      data.push({
        x: [0, 250],
        y: [offset + windowHeight / 2, offset + windowHeight / 2],
        type: "scatter",
        mode: "lines",
        text: eta_c.map((v) => v.toFixed(2)),
        showlegend: false,
        line: { color: "lightgray", width: lineWidth, dash: "dot" },
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
      data.push({
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
      data.push({
        x: [0, 250],
        y: [offset - windowHeight, offset - windowHeight],
        type: "scatter",
        mode: "lines",
        text: max_diff_c.map((v) => v.toFixed(2)),
        showlegend: false,
        line: { color: color, width: lineWidth, dash: "dashdot" },
        hoverinfo: "skip",
      });
    }

    // Pseudo metadata annotation
    const { metadata } = pseudo.quantities;
    const metadataText = metadata
      ? `ν<sub>avg</sub> = ${metadata.avg_nu.toFixed(
          2
        )}<br>ν<sub>max</sub> = ${metadata.max_nu.toFixed(2)} (${
          metadata.max_conf
        })<br>ν<sub>avg</sub> (w/o XO3) = ${metadata.ang_nu.toFixed(2)}`
      : "not all EOS valid";
    annotations.push({
      xref: "paper",
      x: -0.1,
      y: offset,
      text: `<b>${pseudo.name}</b><br>Z<sub>val</sub> = ${pseudo.Z}<br>${metadataText}`,
      showarrow: false,
      align: "left",
      font: { size: 10 },
    });

    // Recommended pseudo highlight
    const shortName = pseudosMetadata[pseudo.name]?.short_name;
    libraries.forEach((library) => {
      if (recommendedPseudos[library].pseudopotential === shortName) {
        const cutoff = recommendedPseudos[library].cutoff_wfc;
        const sizeScalar = library === "efficiency" ? 0.5 : 0.4;
        shapes.push({
          type: library === "efficiency" ? "rect" : "circle",
          xref: "x",
          yref: "y",
          x0: cutoff - deltaX * sizeScalar * 2,
          x1: cutoff + deltaX * sizeScalar * 2,
          y0: offsetsArray[i] - windowHeight * sizeScalar,
          y1: offsetsArray[i] + windowHeight * sizeScalar,
          line: {
            color: "black",
            width: 2,
          },
        });
      }
    });
  });

  // Fake traces for legend
  data.push({
    name: "δω",
    type: "scatter",
    mode: "lines+markers",
    x: [NaN],
    y: [NaN],
    line: { color: "black", width: lineWidth, dash: "solid" },
    marker: { size: markerSize, symbol: "circle" },
    showlegend: true,
    hoverinfo: "skip",
  });
  data.push({
    name: "δV<sub>press</sub>",
    type: "scatter",
    mode: "lines+markers",
    x: [NaN],
    y: [NaN],
    line: { color: "black", width: lineWidth, dash: "dash" },
    marker: { size: markerSize, symbol: "triangle-down" },
    showlegend: true,
    hoverinfo: "skip",
  });
  data.push({
    name: "δE<sub>coh</sub>",
    type: "scatter",
    mode: "lines+markers",
    x: [NaN],
    y: [NaN],
    line: { color: "black", width: lineWidth, dash: "dot" },
    marker: { size: markerSize, symbol: "star" },
    showlegend: true,
    hoverinfo: "skip",
  });
  data.push({
    name: "δv",
    type: "scatter",
    mode: "lines+markers",
    x: [NaN],
    y: [NaN],
    line: { color: "black", width: lineWidth, dash: "solid" },
    marker: { size: markerSize, symbol: "square" },
    showlegend: true,
    hoverinfo: "skip",
  });
  libraries.forEach((library) => {
    data.push({
      x: [null],
      y: [null],
      mode: "markers",
      name: library,
      marker: {
        size: 14,
        symbol: library === "efficiency" ? "square-open" : "circle-open",
        color: "black",
        line: { color: "black", width: 2 },
      },
      showlegend: true,
      hoverinfo: "skip",
    });
  });

  const layout: Partial<Layout> = {
    title: {
      text: `Verification summary: ${element} (${conff})`,
    },
    xaxis: {
      title: {
        text: `Wavefunction cutoff [Ry]; Charge density cutoff [Ry] = ${dual} x Ewfc (PAW/US) | 4 x Ewfc (NC); q-point = [0.5, 0.5, 0.5]`,
      },
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
      side: "right",
      title: {
        text: `Error w.r.t. ref. wavefunction cutoff`,
      },
      zeroline: false,
      showgrid: false,
      showline: true,
      mirror: true,
      ticks: "inside",
      ticklen: 5,
      tickmode: "array",
      tickvals: offsetsArray,
      ticktext: offsetsArray.map(() => "0"),
      range: [-5, (activePseudos.length - 1) * offsetHeight + 5],
      fixedrange: true,
    },
    showlegend: true,
    legend: {
      x: 1.05,
      y: 1,
      xanchor: "left",
      yanchor: "top",
      font: { size: fontSize, color: "black" },
      bordercolor: "lightgrey",
      borderwidth: 1,
    },
    annotations: annotations,
    shapes: shapes,
    hovermode: "closest",
    height: plotHeight,
    margin: {
      l: 160,
      r: 80,
      t: 40,
      b: 80,
    },
  };

  return { data, layout };
};
