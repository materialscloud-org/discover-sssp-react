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
  pseudos,
  values,
  title,
  colorMax,
  tileClickHandler,
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
          x: pseudos,
          y: pseudos,
          colorscale: "Inferno",
          type: "heatmap",
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
              x: pseudos[j],
              y: pseudos[i],
              text: value.toFixed(1),
              showarrow: false,
              font: {
                color: value > colorMax / 2 ? "white" : "black",
                size: 10,
              },
            }))
          )
          .flat(),
        margin: { t: 140, r: 60, b: 40, l: 140 },
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
        const { x, y } = event.points[0];
        tileClickHandler([x as string, y as string]);
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
  }, [pseudos, values, title, colorMax]);

  return <div ref={plotRef} className={styles["chessboard-plot"]} />;
};

export default BandsChessboardPlot;
