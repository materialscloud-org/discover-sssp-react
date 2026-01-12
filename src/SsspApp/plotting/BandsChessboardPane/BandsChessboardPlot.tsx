import React, { useEffect, useRef } from "react";

import type {
  Config,
  Data,
  Layout,
  PlotlyHTMLElement,
  PlotMouseEvent,
} from "plotly.js";

import BandsChessboardPlotProps from "./BandsChessboardPlot.models";
import styles from "./BandsChessboardPlot.module.scss";

const config: Partial<Config> = {
  responsive: true,
  displayModeBar: false,
  scrollZoom: false,
};

const BandsChessboardPlot: React.FC<BandsChessboardPlotProps> = ({
  pseudoFilenames,
  values,
  title,
  onTileClick: handleTileClick,
}) => {
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!plotRef.current) return;

    let Plotly: any | null = null;
    let graphDiv: PlotlyHTMLElement | null = null;
    let destroyed = false;
    let resizeHandler: (() => void) | null = null;

    (async () => {
      Plotly = (await import("@sssp/plotting/PlotlyLoader")).default;

      if (destroyed || !plotRef.current) return;

      const data: Data[] = [
        {
          z: values,
          x: pseudoFilenames,
          y: pseudoFilenames,
          colorscale: [
            [0, "#157347"],
            [0.05, "#2f7d4e"],
            [0.1, "#478655"],
            [0.15, "#5f8e5c"],
            [0.2, "#779563"],
            [0.25, "#8f9c6a"],
            [0.3, "#a7a371"],
            [0.35, "#bfa978"],
            [0.4, "#d7b07f"],
            [0.45, "#efb786"],
            [0.5, "#f0a17c"],
            [0.55, "#e58a70"],
            [0.6, "#da7364"],
            [0.65, "#ce5c58"],
            [0.7, "#c2454c"],
            [0.75, "#b62e40"],
            [0.8, "#aa172f"],
            [0.85, "#9e0e26"],
            [0.9, "#920505"],
            [1, "#870000"],
          ],
          type: "heatmap",
          hovertemplate: `<b>%{x}   |   %{y}<br><b>Max ${title}:</b> %{z:.2f}<extra></extra>`,
        },
        {
          yaxis: "y2",
          mode: "none",
          showlegend: false,
        },
      ];

      const layout: Partial<Layout> = {
        xaxis: {
          side: "top",
          title: { text: "" },
          fixedrange: true,
          tickangle: -90,
        },
        yaxis: {
          autorange: "reversed",
          title: { text: "" },
          fixedrange: true,
        },
        yaxis2: {
          overlaying: "y",
          side: "right",
          title: { text: `Max ${title}`, standoff: 100 },
          showticklabels: false,
          fixedrange: true,
        },
        hoverlabel: { namelength: 0 },
        annotations: values
          .map((row, i) =>
            row.map((value, j) => ({
              x: pseudoFilenames[j],
              y: pseudoFilenames[i],
              text: value.toFixed(1),
              showarrow: false,
              font: {
                color: "white",
                size: Math.max(8, 24 - pseudoFilenames.length),
              },
            }))
          )
          .flat(),
        margin: { t: 160, r: 100, b: 40, l: 160 },
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
      };

      graphDiv = (await Plotly.react(
        plotRef.current,
        data,
        layout,
        config
      )) as PlotlyHTMLElement;

      graphDiv.on("plotly_click", (event: PlotMouseEvent) => {
        const { x, y, pointIndex } = event.points[0];
        const plotIndex = title == "v" ? 0 : 1;
        handleTileClick(
          plotIndex,
          [y as string, x as string],
          pointIndex as any // `any` because Plotly incorrectly defines it as `number` instead of `number[]`
        );
      });

      const handleResize = (gd: PlotlyHTMLElement) => {
        if (!gd) return;
        const update = {
          width: gd.offsetWidth,
          height: gd.offsetWidth,
        };
        Plotly.relayout(gd, update);
      };

      resizeHandler = () => handleResize(graphDiv!);
      window.addEventListener("resize", resizeHandler);
      handleResize(graphDiv);

      return () => {
        if (graphDiv) graphDiv.removeAllListeners?.("plotly_click");
      };
    })();

    return () => {
      destroyed = true;
      if (resizeHandler) window.removeEventListener("resize", resizeHandler);
      if (Plotly && graphDiv) {
        try {
          graphDiv.removeAllListeners?.("plotly_click");
          Plotly.purge(graphDiv);
        } catch (error) {
          console.error("Error purging BandsChessboardPlot:", error);
        }
      }
    };
  }, [pseudoFilenames, values, title]);

  return <div ref={plotRef} className={styles["chessboard-plot"]} />;
};

export default BandsChessboardPlot;
