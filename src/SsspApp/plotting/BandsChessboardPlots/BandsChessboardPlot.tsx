import React, { useEffect, useMemo, useRef } from "react";

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
  colorMax,
  tileClickHandler,
}) => {
  const plotRef = useRef<HTMLDivElement>(null);

  const shortNames = useMemo(
    () => pseudoFilenames.map(pseudoFilenameToShortname),
    [pseudoFilenames]
  );

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
          x: shortNames,
          y: shortNames,
          colorscale: "Inferno",
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
              x: shortNames[j],
              y: shortNames[i],
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
        tileClickHandler([y as string, x as string]);
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

const SUFFIXES_TO_REMOVE = new Set(["n", "spn", "spfn", "spdn", "spdfn", "sl"]);

const FILENAME_TO_SHORTNAME_MAP: Record<string, string> = {
  "dojo.v0.4.1-std": "DOJO-041-std",
  "dojo.v0.4.1-str": "DOJO-041-str",
  "dojo.v0.5.0-std": "DOJO-050-std",
  "dojo.v0.5.0-str": "DOJO-050-str",
  "spms.v1": "SPMS",
  "sg15.v0": "SG15",
  "us+gbrv.v1": "GBRV-1.X",
  "us+psl.v1.0.0-high": "PSL-US-v1-high",
  "us+psl.v1.0.0-low": "PSL-US-v1-low",
  "us+psl.v0": "PSL-US-v0.x",
  "paw+psl.v0": "PSL-PAW-v0.x",
  "paw+psl.v1.0.0-high": "PSL-PAW-v1-high",
  "paw+psl.v1.0.0-low": "PSL-PAW-v1-low",
  "paw+jth.v1.1-std": "JTH-1.1-std",
  "paw+jth.v1.1-str": "JTH-1.1-str",
  "paw+wentzcovitch.v1.0.legacy": "Wentzcovitch",
  "paw+uni-marburg.v0": "MARBURG",
};

function pseudoFilenameToShortname(pseudo: string): string {
  let parts = pseudo.split(".");
  parts = parts.slice(1, parts.length - 1); // Remove element and file extension
  if (SUFFIXES_TO_REMOVE.has(parts[parts.length - 1])) {
    parts = parts.slice(0, parts.length - 1);
  }

  let category = parts[0]; // nc, us, paw

  let remaining = parts.slice(4).join(".");

  let prefix = category === "us" || category === "paw" ? `${category}+` : "";

  // Handle special cases
  if (remaining.includes("psl.v0")) {
    remaining = remaining.split("v0")[0] + "v0";
  } else {
    const keys = ["gbrv.v1", "gbrv.v1.5"];
    for (let key of keys) {
      if (remaining.includes(key)) {
        remaining = key;
        break;
      }
    }
  }

  let key = prefix + remaining;

  return FILENAME_TO_SHORTNAME_MAP[key] || pseudo;
}
