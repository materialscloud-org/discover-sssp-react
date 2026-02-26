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
  title,
  chessboardPseudos,
  values,
  zMax,
  onTileClick: handleTileClick,
}) => {
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!plotRef.current) return;

    let Plotly: typeof import("plotly.js") | null = null;
    let graphDiv: PlotlyHTMLElement | null = null;
    let destroyed = false;
    let resizeHandler: (() => void) | null = null;

    (async () => {
      Plotly = (await import("@sssp/plotting/PlotlyLoader")).default;

      if (destroyed || !plotRef.current) return;

      const zOffDiagonal = values.map((row, i) =>
        row.map((value, j) => (i === j ? null : value)),
      );

      const zDiagonalMask = values.map((row, i) =>
        row.map((_, j) => (i === j ? 1 : null)),
      );

      const data: Data[] = [
        {
          z: zOffDiagonal,
          x: chessboardPseudos,
          y: chessboardPseudos,
          zmin: 0,
          zmax: zMax,
          colorscale: [
            [0, "#157347"],
            [0.5, "#f0a17c"],
            [1, "#870000"],
          ],
          type: "heatmap",
          hoverongaps: false,
          hovertemplate: `<b>x:</b> %{x}<br /><b>y:</b> %{y}<br><b>Max ${title}:</b> %{z:.2f}<extra></extra>`,
        },
        {
          z: zDiagonalMask,
          x: chessboardPseudos,
          y: chessboardPseudos,
          zmin: 0,
          zmax: 1,
          colorscale: [
            [0, "#ffffff"],
            [1, "#ffffff"],
          ],
          showscale: false,
          type: "heatmap",
          hoverinfo: "skip",
        },
      ];

      const layout: Partial<Layout> = {
        xaxis: {
          side: "top",
          title: { text: title, standoff: 10, font: { size: 20 } },
          linecolor: "black",
          mirror: true,
          fixedrange: true,
          tickangle: -45,
        },
        yaxis: {
          autorange: "reversed",
          title: { text: `Max ${title}`, standoff: 10, font: { size: 20 } },
          linecolor: "black",
          mirror: true,
          fixedrange: true,
          tickangle: -45,
        },
        hoverlabel: { namelength: 0 },
        annotations: values
          .map((row, i) =>
            row
              .map((value, j) => ({
                x: chessboardPseudos[j],
                y: chessboardPseudos[i],
                text:
                  value >= 100
                    ? value.toExponential(0).toString().replace("e+", "e")
                    : value.toFixed(1),
                showarrow: false,
                font: {
                  color: "white",
                  size: Math.max(8, 24 - chessboardPseudos.length),
                },
              }))
              .filter((_, j) => j !== i),
          )
          .flat(),
        margin: { t: 160, r: 110, b: 40, l: 160 },
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
      };

      graphDiv = (await Plotly.react(
        plotRef.current,
        data,
        layout,
        config,
      )) as PlotlyHTMLElement;

      graphDiv.on("plotly_click", (event: PlotMouseEvent) => {
        const { x, y, pointIndex } = event.points[0];
        const plotIndex = title == "v" ? 0 : 1;
        handleTileClick(
          plotIndex,
          [y as string, x as string],
          // `any` because Plotly incorrectly defines it as `number` instead of `number[]`
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          pointIndex as any,
        );
      });

      const handleResize = (gd: PlotlyHTMLElement) => {
        if (!gd) return;
        const update = {
          width: gd.offsetWidth,
          height: gd.offsetWidth,
        };
        if (Plotly) Plotly.relayout(gd, update);
      };

      resizeHandler = () => handleResize(graphDiv!);
      window.addEventListener("resize", resizeHandler);
      handleResize(graphDiv);

      return () => {
        destroyed = true;
        if (resizeHandler) window.removeEventListener("resize", resizeHandler);
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
  }, [chessboardPseudos, values, title, zMax, handleTileClick]);

  return <div ref={plotRef} className={styles["chessboard-plot"]} />;
};

export default BandsChessboardPlot;
