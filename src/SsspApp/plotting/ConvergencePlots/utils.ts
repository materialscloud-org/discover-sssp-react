import type {
  Annotations,
  Dash,
  PlotData,
  Layout,
  MarkerSymbol,
  Shape,
} from "plotly.js";

import { ElementInfo, PseudosMetadata } from "@sssp/models";

import { Pseudo } from "./ConvergencePlot.models";

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

const labels = ["δω", "δV<sub>press</sub>", "δE<sub>coh</sub>", "δv"];
const symbols: MarkerSymbol[] = ["circle", "triangle-down", "star", "square"];
const dashes: Dash[] = ["solid", "dash", "dot", "solid"];

type Quantity = {
  label: string;
  symbol: MarkerSymbol;
  dash: Dash;
};

const QUANTITIES: Record<string, Quantity> = {
  phononFrequencies: {
    label: "δω",
    symbol: "circle",
    dash: "solid",
  },
  pressure: {
    label: "δV<sub>press</sub>",
    symbol: "triangle-down",
    dash: "dash",
  },
  cohesiveEnergy: {
    label: "δE<sub>coh</sub>",
    symbol: "star",
    dash: "dot",
  },
  eos: {
    label: "δv",
    symbol: "square",
    dash: "solid",
  },
};

export function generateConvergencePlotData(
  element: string,
  conff: string,
  libraries: string[],
  recommendedPseudos: { [key: string]: ElementInfo },
  activePseudos: Pseudo[],
  pseudosMetadata: PseudosMetadata
): {
  data: Partial<PlotData>[];
  layout: Partial<Layout>;
} {
  const windowHeight = offsetHeight / 4;
  const offsetsArray = activePseudos.map((_, i) => i * offsetHeight);
  const plotHeight =
    activePseudos.length * PIXELS_PER_PSEUDO + (topMargin + bottomMargin);

  const dual = HIGH_DUAL_ELEMENTS.has(element) ? 18 : 8;

  const data: Partial<PlotData>[] = [];
  const annotations: Partial<Annotations>[] = [];
  const shapes: Partial<Shape>[] = [];

  activePseudos.forEach((pseudo, i) => {
    const color = pseudosMetadata[pseudo.name]?.color || "black";
    const offset = i * offsetHeight;

    const { quantities } = pseudo;

    let frequencies: number[] = [],
      freqError: number[] = [],
      pressure: number[] = [],
      cohesiveEnergy: number[] = [],
      eos: number[] = [];

    if (quantities.phononFrequencies) {
      frequencies = quantities.phononFrequencies.values.map(
        (v) => (v * 2) / PHONON_C_FACTOR
      );
      let dataSeries = generateDataSeries(QUANTITIES.phononFrequencies, color);
      dataSeries.x = quantities.phononFrequencies.cutoffs;
      dataSeries.y = frequencies.map((v) => v + offset);
      freqError = quantities.phononFrequencies.error;
      dataSeries.error_y = {
        type: "data",
        array: freqError,
        arrayminus: frequencies.map(() => 0),
        visible: true,
        color: color,
      };
      data.push(dataSeries);

      // Max phonon frequency annotation
      const omegaRef = quantities.phononFrequencies.ref.toFixed(2);
      annotations.push({
        x: 203.1,
        y: offset - 1,
        text: `ω<sub>max</sub> = ${omegaRef} cm<sup>-1</sup>`,
        showarrow: false,
        font: { size: fontSize },
      });
    }

    if (quantities.pressure) {
      let dataSeries = generateDataSeries(QUANTITIES.pressure, color);
      pressure = quantities.pressure.values.map(
        (v) => (v * 2) / PRESSURE_C_FACTOR
      );
      dataSeries.x = quantities.pressure.cutoffs;
      dataSeries.y = pressure.map((v) => v + offset);
      data.push(dataSeries);
    }

    if (quantities.cohesiveEnergy) {
      let dataSeries = generateDataSeries(QUANTITIES.cohesiveEnergy, color);
      cohesiveEnergy = quantities.cohesiveEnergy.values;
      dataSeries.x = quantities.cohesiveEnergy.cutoffs;
      dataSeries.y = cohesiveEnergy.map((v) => v + offset);
      data.push(dataSeries);

      // Cohesive energy ref
      const cohesiveRef = quantities.cohesiveEnergy.ref.toFixed(2);
      annotations.push({
        x: 205,
        y: offset + 1,
        text: `E<sub>coh</sub> = ${cohesiveRef} <i>meV/atom</i>`,
        showarrow: false,
        font: { size: fontSize },
      });
    }

    if (quantities.eos) {
      let dataSeries = generateDataSeries(QUANTITIES.eos, color);
      eos = quantities.eos.values.map((v) => (v * 2) / EOS_C_FACTOR);
      dataSeries.x = quantities.eos.cutoffs;
      dataSeries.y = eos.map((v) => v + offset);
      data.push(dataSeries);
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

    // Zero line
    shapes.push({
      type: "line",
      x0: 18,
      x1: 216,
      y0: offset,
      y1: offset,
      opacity: 0.25,
      line: { width: 0.5 },
    });

    // Shared hover tip
    const cutoffs = pseudo.quantities.bands?.cutoffs || [];

    const customData = [cutoffs];
    const hoverLines = [`E<sub>wfc</sub> = %{customdata[0]} Ry<br>`];

    let colIndex = 1;

    // Phonon frequency (and optional error)
    if (frequencies.length) {
      customData.push(frequencies);
      let line = `δω = %{customdata[${colIndex}]:.3f}`;
      colIndex += 1;
      if (freqError.length) {
        customData.push(freqError);
        line += ` &plusmn; %{customdata[${colIndex}]:.1e}`;
        colIndex += 1;
      }
      line += ` cm<sup>-1</sup><br>`;
      hoverLines.push(line);
    }

    // Pressure
    if (pressure.length) {
      customData.push(pressure);
      hoverLines.push(
        `δV<sub>press</sub> = %{customdata[${colIndex}]:.3f}<br>`
      );
      colIndex += 1;
    }

    // Cohesive energy
    if (cohesiveEnergy.length) {
      customData.push(cohesiveEnergy);
      hoverLines.push(`δE<sub>coh</sub> = %{customdata[${colIndex}]:.3f}<br>`);
      colIndex += 1;
    }

    // Equation of state
    if (eos.length) {
      customData.push(eos);
      hoverLines.push(`δv = %{customdata[${colIndex}]:.3f}`);
      colIndex += 1;
    }

    data.push({
      x: cutoffs,
      y: new Array(cutoffs.length).fill(offset),
      mode: "markers",
      marker: {
        size: 24,
        opacity: 0,
        line: { width: 0 },
      },
      showlegend: false,
      customdata: cutoffs.map((_, row) => customData.map((col) => col[row])),
      hoverlabel: {
        bgcolor: "rgb(225, 225, 225)",
        bordercolor: "black",
      },
      hovertemplate:
        `<b>${pseudo.name}</b><br>` + hoverLines.join("") + `<extra></extra>`,
    });

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
        let shapeType, sizeScalar, fillColor, lineColor;
        if (library === "efficiency") {
          shapeType = "rect";
          sizeScalar = 0.5;
          fillColor = "lightgreen";
          lineColor = "green";
        } else {
          shapeType = "circle";
          sizeScalar = 0.4;
          fillColor = "lightcoral";
          lineColor = "red";
        }
        shapes.push({
          type: shapeType as any,
          xref: "x",
          yref: "y",
          x0: cutoff - deltaX * sizeScalar * 2,
          x1: cutoff + deltaX * sizeScalar * 2,
          y0: offsetsArray[i] - windowHeight * sizeScalar,
          y1: offsetsArray[i] + windowHeight * sizeScalar,
          fillcolor: fillColor,
          line: { width: 1, color: lineColor },
          opacity: 0.5,
        });
      }
    });
  });

  // Fake traces for legend
  labels.forEach((label, i) => {
    data.push({
      name: label,
      type: "scatter",
      mode: "lines+markers",
      x: [NaN],
      y: [NaN],
      line: { color: "black", width: lineWidth, dash: dashes[i] },
      marker: { size: markerSize, symbol: symbols[i] },
      showlegend: true,
      legendgroup: label,
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
    margin: { l: 160, r: 80, t: 40, b: 80 },
  };

  return { data, layout };
}

function generateDataSeries(
  quantity: Quantity,
  color: string
): Partial<PlotData> {
  return {
    name: quantity.label,
    type: "scatter",
    mode: "lines+markers",
    line: { color: color, width: lineWidth, dash: quantity.dash },
    marker: { size: markerSize, symbol: quantity.symbol },
    showlegend: false,
    legendgroup: quantity.label,
    hoverinfo: "skip",
  };
}
