import type {
  Annotations,
  Dash,
  Layout,
  MarkerSymbol,
  PlotData,
  PlotlyHTMLElement,
  Shape,
} from "plotly.js";

import { ElementInfo, Pseudo, PseudosMetadata } from "@sssp/models";

import { formatSubscripts } from "@sssp/plotting/utils";

const aboveScalar = 1.2; // offset for annotations above the efficiency line
const belowScalar = 1.3; // offset for annotations below the efficiency line
const annotationOffset = 0.13; // offset for last point annotations

const markerSize = 6;
const lineWidth = 1;
const fontSize = 10;

const topMargin = 40;
const bottomMargin = 80;

const deltaX = 1.6; // highlight rectangle half-width

const offsetHeight = 8; // offset between pseudos
const pixelsPerPseudo = 120; // fixed

const plotMargins = { l: 180, r: 180, t: 40, b: 80 };

const xTickStepSize = 10;
const xTickSpacePixels = 80;

export const xMin = 25;
export const xMax = 205;
export const windowSize = 100;

const HIGH_DUAL_ELEMENTS = new Set(["O", "Fe", "Mn", "Hf", "Co", "Ni", "Cr"]);

const EOS_C_FACTOR = 0.2;
const PHONON_C_FACTOR = 2;
const PRESSURE_C_FACTOR = 1;

const labels = ["δω", "δV<sub>press</sub>", "δE<sub>coh</sub>", "δν"];
const symbols: MarkerSymbol[] = ["circle", "triangle-down", "star", "square"];
const dashes: Dash[] = ["solid", "dash", "dot", "solid"];

type Quantity = {
  label: string;
  symbol: MarkerSymbol;
  dash: Dash;
};

export type XRange = { min: number; max: number };

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
    label: "δν",
    symbol: "square",
    dash: "solid",
  },
};

export const generateConvergencePlotData = (
  element: string,
  libraries: string[],
  recommendedPseudos: { [key: string]: ElementInfo },
  activePseudos: Pseudo[],
  pseudosMetadata: PseudosMetadata,
): {
  data: Partial<PlotData>[];
  layout: Partial<Layout>;
} => {
  const windowHeight = offsetHeight / 4;
  const offsetsArray = activePseudos.map((_, i) => i * offsetHeight);
  const plotHeight =
    activePseudos.length * pixelsPerPseudo + (topMargin + bottomMargin);

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
      eos: number[] = [],
      eta_c: number[] = [],
      max_diff_c: number[] = [];

    let dataSeries;

    // Efficiency line
    // Above
    data.push({
      x: [-1000, 1000],
      y: [offset + windowHeight, offset + windowHeight],
      type: "scatter",
      mode: "lines",
      text: eta_c.map((v) => v.toFixed(2)),
      showlegend: false,
      line: { color: color, width: lineWidth, dash: "dashdot" },
      hoverinfo: "skip",
    });
    // Below
    data.push({
      x: [-1000, 1000],
      y: [offset - windowHeight, offset - windowHeight],
      type: "scatter",
      mode: "lines",
      text: max_diff_c.map((v) => v.toFixed(2)),
      showlegend: false,
      line: { color: color, width: lineWidth, dash: "dashdot" },
      hoverinfo: "skip",
    });

    // Precision line
    data.push({
      x: [-1000, 1000],
      y: [offset + windowHeight * 0.5, offset + windowHeight * 0.5],
      type: "scatter",
      mode: "lines",
      text: eta_c.map((v) => v.toFixed(2)),
      showlegend: false,
      line: { color: "lightgray", width: lineWidth, dash: "dot" },
      hoverinfo: "skip",
    });

    if (quantities.phononFrequencies) {
      frequencies = quantities.phononFrequencies.values;
      dataSeries = generateDataSeries(QUANTITIES.phononFrequencies, color);
      dataSeries.x = quantities.phononFrequencies.cutoffs;
      dataSeries.y = frequencies.map((v) => (v * 2) / PHONON_C_FACTOR + offset);
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
        xref: "paper",
        x: 1,
        xanchor: "left",
        xshift: 20,
        y: offset - 0.6,
        text: `ω<sub>max</sub> = ${omegaRef} cm<sup>-1</sup>`,
        showarrow: false,
        align: "left",
        font: { size: fontSize },
      });
    }

    if (quantities.pressure) {
      dataSeries = generateDataSeries(QUANTITIES.pressure, color);
      pressure = quantities.pressure.values;
      dataSeries.x = quantities.pressure.cutoffs;
      dataSeries.y = pressure.map((v) => (v * 2) / PRESSURE_C_FACTOR + offset);
      data.push(dataSeries);
    }

    if (quantities.cohesiveEnergy) {
      cohesiveEnergy = quantities.cohesiveEnergy.values;
      dataSeries = generateDataSeries(QUANTITIES.cohesiveEnergy, color);
      dataSeries.x = quantities.cohesiveEnergy.cutoffs;
      dataSeries.y = cohesiveEnergy.map((v) => v + offset);
      data.push(dataSeries);

      // Cohesive energy ref
      const cohesiveRef = quantities.cohesiveEnergy.ref.toFixed(2);
      annotations.push({
        xref: "paper",
        x: 1,
        xanchor: "left",
        xshift: 20,
        y: offset + 0.6,
        text: `E<sub>coh</sub> = ${cohesiveRef} <i>meV/atom</i>`,
        align: "left",
        showarrow: false,
        font: { size: fontSize },
      });
    }

    if (quantities.eos) {
      eos = quantities.eos.values;
      dataSeries = generateDataSeries(QUANTITIES.eos, color);
      dataSeries.x = quantities.eos.cutoffs;
      dataSeries.y = eos.map((v) => (v * 2) / EOS_C_FACTOR + offset);
      data.push(dataSeries);
    }

    if (quantities.bands) {
      const x = quantities.bands.cutoffs;
      eta_c = quantities.bands.etaC;
      max_diff_c = quantities.bands.maxDiffC;

      // η10
      data.push({
        x: x,
        y: eta_c.map(() => offset + aboveScalar * windowHeight),
        type: "scatter",
        mode: "text",
        text: eta_c.map((v) =>
          v >= 100
            ? v.toExponential(0).toString().replace("e+", "e")
            : v.toFixed(2),
        ),
        showlegend: false,
        textfont: { size: fontSize },
        hoverinfo: "skip",
      });
      annotations.push({
        xref: "paper",
        x: 1,
        xanchor: "left",
        xshift: 20,
        y: offset - belowScalar * windowHeight + annotationOffset,
        text: "max <i>η</i><sub>10</sub> [meV]",
        showarrow: false,
        align: "left",
        font: { size: fontSize },
      });

      // max η10
      data.push({
        x: x,
        y: max_diff_c.map(() => offset - belowScalar * windowHeight),
        type: "scatter",
        mode: "text",
        text: max_diff_c.map((v) =>
          v >= 100
            ? v.toExponential(0).toString().replace("e+", "e")
            : v.toFixed(2),
        ),
        showlegend: false,
        textfont: { size: fontSize },
        hoverinfo: "skip",
      });
      annotations.push({
        xref: "paper",
        x: 1,
        xanchor: "left",
        xshift: 20,
        y: offset + aboveScalar * windowHeight + annotationOffset,
        text: "<i>η</i><sub>10</sub> [meV]",
        showarrow: false,
        align: "left",
        font: { size: fontSize },
      });
    }

    // Zero line
    shapes.push({
      type: "line",
      x0: -1000,
      x1: 1000,
      y0: offset,
      y1: offset,
      opacity: 0.25,
      line: { width: 0.5 },
    });

    // Shared hover tip
    const cutoffs = pseudo.quantities.bands?.cutoffs || [];

    const customData = [cutoffs];
    const hoverLines = [`E<sub>wfc</sub> = %{customdata[0]} Ry`];

    let colIndex = 1;

    // Phonon frequency (and optional error)
    if (frequencies.length) {
      customData.push(frequencies);
      let line = `<br />δω = %{customdata[${colIndex}]:.3f}`;
      colIndex += 1;
      if (freqError.length) {
        customData.push(freqError);
        line += ` &plusmn; %{customdata[${colIndex}]:.1e}`;
        colIndex += 1;
      }
      line += `%`;
      hoverLines.push(line);
    }

    // Pressure
    if (pressure.length) {
      customData.push(pressure);
      hoverLines.push(
        `<br />δV<sub>press</sub> = %{customdata[${colIndex}]:.3f}%`,
      );
      colIndex += 1;
    }

    // Cohesive energy
    if (cohesiveEnergy.length) {
      customData.push(cohesiveEnergy);
      hoverLines.push(
        `<br />δE<sub>coh</sub> = %{customdata[${colIndex}]:.3f} meV`,
      );
      colIndex += 1;
    }

    // Equation of state
    if (eos.length) {
      customData.push(eos);
      hoverLines.push(`<br />δv = %{customdata[${colIndex}]:.3f}`);
      colIndex += 1;
    }

    // Band structures
    if (eta_c.length) {
      customData.push(eta_c);
      hoverLines.push(
        `<br />η<sub>10</sub> = %{customdata[${colIndex}]:.3f} meV`,
      );
      colIndex += 1;
    }
    if (max_diff_c.length) {
      customData.push(max_diff_c);
      hoverLines.push(
        `<br />max η<sub>10</sub> = %{customdata[${colIndex}]:.3f} meV`,
      );
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
        `<b>${pseudo.name}</b><br />` + hoverLines.join("") + `<extra></extra>`,
    });

    // Pseudo metadata annotation
    const { metadata } = pseudo.quantities;
    let metadataText = "not all EOS valid";
    if (metadata) {
      const avg_nu = metadata.avgNu.toFixed(2);
      const max_nu = metadata.maxNu.toFixed(2);
      const max_conf = formatSubscripts(metadata.maxConf);
      const avg_nu_wo_max = metadata.avgNuWoMax.toFixed(2);
      metadataText = `ν<sub>avg</sub> = ${avg_nu}<br />ν<sub>max</sub> = ${max_nu} (${max_conf})<br />ν<sub>avg</sub> (w/o ${max_conf}) = ${avg_nu_wo_max}`;
    }
    annotations.push({
      xref: "paper",
      x: 0,
      xanchor: "right",
      xshift: -30,
      y: offset,
      text: `<span style="color:${pseudo.color}"><b>${pseudo.name}</b></span><br />Z<sub>val</sub> = ${pseudo.Z}<br />${metadataText}`,
      showarrow: false,
      align: "left",
      font: { size: 10 },
      captureevents: true,
    });

    // Recommended pseudo highlight
    libraries.forEach((library) => {
      if (
        recommendedPseudos[library].pseudopotential === pseudo.name &&
        recommendedPseudos[library].Z === pseudo.Z
      ) {
        const cutoff = recommendedPseudos[library].cutoff_wfc;
        if (library === "efficiency") {
          shapes.push({
            type: "rect",
            x0: cutoff - deltaX * 0.5,
            x1: cutoff + deltaX * 0.5,
            y0: offsetsArray[i] - windowHeight,
            y1: offsetsArray[i] + windowHeight,
            fillcolor: "rgba(0, 128, 0, 0.5)",
            line: { width: 1, color: "rgb(0, 128, 0)" },
            opacity: 0.5,
          });
        } else {
          const x0 = cutoff - deltaX;
          const x1 = cutoff + deltaX;
          const y0 = offsetsArray[i] - windowHeight * 0.5;
          const y1 = offsetsArray[i] + windowHeight * 0.5;
          const xm = (x0 + x1) * 0.5;
          const ym = (y0 + y1) * 0.5;
          shapes.push({
            type: "path",
            path: `M ${xm} ${y1} L ${x1} ${ym} L ${xm} ${y0} L ${x0} ${ym} Z`,
            fillcolor: "rgba(128, 0, 128, 0.5)",
            line: { width: 1, color: "rgb(128, 0, 128)" },
            opacity: 0.5,
          });
        }
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
    xaxis: {
      title: {
        text: `Wavefunction cutoff [Ry]<br><br>Charge density cutoff [Ry] = ${dual} x Ewfc (PAW/US) | 4 x Ewfc (NC); q-point = [0.5, 0.5, 0.5]`,
      },
      zeroline: false,
      showgrid: false,
      showline: true,
      mirror: true,
      tickvals: [...Array.from({ length: 18 }, (_, i) => i * 10 + 30)],
      ticks: "inside",
      ticklen: 5,
      range: [xMin, xMin + windowSize],
    },
    yaxis: {
      side: "left",
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
      orientation: "h",
      xref: "paper",
      yref: "container",
      x: 0.5,
      y: 1,
      xanchor: "center",
      yanchor: "top",
      font: { size: 12, color: "black" },
    },
    annotations: annotations,
    shapes: shapes,
    hovermode: "closest",
    dragmode: "pan",
    autosize: true,
    height: plotHeight,
    margin: plotMargins,
  };

  return { data, layout };
};

const generateDataSeries = (
  quantity: Quantity,
  color: string,
): Partial<PlotData> => {
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
};

export const getEventXRange = (
  event: unknown,
): { x0: number; x1: number } | null => {
  if (!event || typeof event !== "object") return null;

  const e = event as Record<string, unknown>;

  const rangeArray = e["xaxis.range"];
  if (Array.isArray(rangeArray) && rangeArray.length >= 2) {
    const x0 = Number(rangeArray[0]);
    const x1 = Number(rangeArray[1]);
    if (Number.isFinite(x0) && Number.isFinite(x1)) return { x0, x1 };
  }

  const x0 = Number(e["xaxis.range[0]"]);
  const x1 = Number(e["xaxis.range[1]"]);
  if (Number.isFinite(x0) && Number.isFinite(x1)) return { x0, x1 };

  return null;
};

/** Plotly relayout events are not strongly typed and can vary in shape. */
export const isPlotlyXAutoRangeEvent = (event: unknown): boolean => {
  if (!event || typeof event !== "object") return false;
  const record = event as Record<string, unknown>;
  return record["xaxis.autorange"] === true;
};

/**
 * Returns the usable plot area width (inside margins) in pixels.
 * This is used to keep tick spacing constant in *pixels* by adjusting the shown x-span.
 */
export const getPlotAreaWidthPx = (host: HTMLDivElement | null): number => {
  if (!host) return 0;
  const hostWidthPx = host.getBoundingClientRect().width;
  const plotAreaWidthPx = hostWidthPx - plotMargins.l - plotMargins.r;
  return Math.max(0, plotAreaWidthPx);
};

/**
 * Clamp an x-range to [xMin, xMax] while enforcing a fixed window span.
 * If Plotly gives an odd range (non-finite or wrong span), we snap to a sensible range.
 */
export const clampXRangeToDomain = (
  requestedRange: XRange,
  windowSpanRy: number,
): XRange => {
  const domainSpanRy = xMax - xMin;
  const clampedWindowSpanRy = Math.min(Math.max(windowSpanRy, 1), domainSpanRy);

  let min = requestedRange.min;
  let max = requestedRange.max;

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    min = xMin;
    max = xMin + clampedWindowSpanRy;
  } else if (Math.abs(max - min - clampedWindowSpanRy) > 1e-6) {
    const center = (min + max) * 0.5;
    min = center - clampedWindowSpanRy * 0.5;
    max = center + clampedWindowSpanRy * 0.5;
  }

  if (min < xMin) {
    min = xMin;
    max = xMin + clampedWindowSpanRy;
  } else if (max > xMax) {
    max = xMax;
    min = xMax - clampedWindowSpanRy;
  }

  return { min, max };
};

/**
 * Compute the visible x-span (in Ry) such that a tick step of `xTickStepSize` Ry
 * appears approximately `xTickSpacePixels` pixels apart.
 */
export const computeXWindowSpanRyForPlotWidth = (
  plotAreaWidthPx: number,
): number => {
  if (!plotAreaWidthPx) return windowSize;

  // Keep a constant scale: xWindowSpanRy = plotAreaWidthPx * (tickStepRy / tickSpacingPx)
  const spanRy = (plotAreaWidthPx * xTickStepSize) / xTickSpacePixels;
  const domainSpanRy = xMax - xMin;

  // Keep a sensible minimum window so the plot doesn't get unusably zoomed in.
  return Math.min(Math.max(spanRy, 30), domainSpanRy);
};

export const getGraphDivXRange = (
  graphDiv: PlotlyHTMLElement,
): XRange | null => {
  const currentRange = graphDiv.layout?.xaxis?.range as
    | [number, number]
    | undefined;
  if (!currentRange) return null;
  const min = currentRange[0];
  const max = currentRange[1];
  if (!Number.isFinite(min) || !Number.isFinite(max)) return null;
  return { min, max };
};

/**
 * Plotly uses margin to reserve space for the legend.
 * We tweak the top margin for very small x-windows to reduce legend overlap.
 */
export const getMarginsForXWindowSpan = (windowSpanRy: number) => {
  return {
    ...plotMargins,
    // Note: larger top margin gives more room for the wrapped legend.
    t: windowSpanRy < 35 ? 70 : 40,
  };
};

export const scheduleNextFrame = (callback: FrameRequestCallback) => {
  if (
    typeof window !== "undefined" &&
    typeof window.requestAnimationFrame === "function"
  ) {
    window.requestAnimationFrame(callback);
    return;
  }
  setTimeout(callback, 0);
};
