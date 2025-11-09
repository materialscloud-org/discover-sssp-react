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
  element,
  pseudos,
  values,
  title,
  colorMax,
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
          title: { text: `max ${title}`, standoff: 15 },
          fixedrange: true,
        },
        margin: { t: 80, r: 60, b: 40, l: 100 },
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
      };

      graphDiv = (await Plotly.react(
        plotRef.current,
        data,
        layout,
        config
      )) as PlotlyHTMLElement;

      const handleClick = (event: PlotMouseEvent) => {
        const { x, y } = event.points[0];
        console.log(x, y);
      };

      graphDiv.on("plotly_click", handleClick);

      const keepAspectRatio = (gd: any) => {
        if (!gd) return;
        const update = {
          width: gd.offsetWidth,
          height: gd.offsetWidth,
        };
        Plotly.relayout(gd, update);
      };

      window.addEventListener("resize", () => keepAspectRatio(graphDiv));
      keepAspectRatio(graphDiv);

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
        } catch {
          /* ignore */
        }
      }
    };
  }, [element, pseudos, values, title, colorMax]);

  return <div ref={plotRef} className={styles["chessboard-plot"]} />;
};

export default BandsChessboardPlot;
