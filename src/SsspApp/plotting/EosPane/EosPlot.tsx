import { useContext, useEffect, useRef } from "react";

import type { Config, Data, Layout, PlotlyHTMLElement } from "plotly.js";

import { PseudosContext } from "@sssp/context";
import { EosPlotData } from "@sssp/models";
import { formatSubscripts } from "@sssp/plotting/utils";

import EosPlotProps from "./EosPlot.models";
import styles from "./EosPlot.module.scss";
import { BM } from "./utils";

const refRes = 1000;
const hoverDigits = 2;

const config: Partial<Config> = {
  displaylogo: false,
  responsive: true,
  modeBarButtonsToRemove: [
    "zoomIn2d",
    "zoomOut2d",
    "autoScale2d",
    "lasso2d",
    "select2d",
  ],
};

const EosPlot: React.FC<EosPlotProps> = ({
  configuration,
  eosPseudosMap,
  activePseudos,
}) => {
  const { pseudosMetadata } = useContext(PseudosContext);
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!plotRef.current) return;

    let Plotly: any | null = null;
    let graphDiv: PlotlyHTMLElement | null = null;
    let destroyed = false;
    let resizeHandler: (() => void) | null = null;

    const volumes = Object.values(eosPseudosMap).flatMap(
      (eosData) => eosData.volumes || [],
    );
    const minVolume = Math.min(...volumes);
    const maxVolume = Math.max(...volumes);

    (async () => {
      Plotly = (await import("@sssp/plotting/PlotlyLoader")).default;

      if (destroyed || !plotRef.current) return;

      const data: Data[] = Object.entries(eosPseudosMap)
        .filter(([pseudo]) => activePseudos.includes(pseudo))
        .map(([pseudo, eosData]: [string, EosPlotData]) => {
          const pseudoName = pseudo.split("-Z=")[0];
          const color = pseudosMetadata[pseudoName]?.color || "black";
          if (pseudo !== "REF" && eosData.volumes && eosData.energies) {
            const sorted = eosData.volumes
              .map((volume: number, i: number) => ({
                volume,
                energy: (eosData.energies?.[i] || 0.0) - (eosData?.E0 || 0.0),
              }))
              .sort(
                (a: { volume: number }, b: { volume: number }) =>
                  a.volume - b.volume,
              );
            const x = sorted.map((p: { volume: any }) => p.volume);
            const y = sorted.map((p: { energy: any }) => p.energy);
            return {
              x,
              y,
              mode: "lines+markers",
              type: "scatter",
              line: { shape: "spline" },
              name: pseudo,
              marker: {
                color: color,
              },
              hovertemplate:
                pseudo +
                `<br>Volume = %{x:.${hoverDigits}f} Å³/atom` +
                `<br>Energy = %{y:.${hoverDigits}f} eV/atom` +
                (eosData.nu
                  ? `<br>\u03BD = ${eosData.nu?.toFixed(hoverDigits)}`
                  : "") +
                "<extra></extra>",
              hoverlabel: { align: "left" },
            };
          } else {
            const x = Array.from(
              { length: refRes },
              (_, i) =>
                minVolume + (i * (maxVolume - minVolume)) / (refRes - 1),
            );
            return {
              x,
              y: BM(x, eosData.V0, 0, eosData.B0, eosData.B1),
              mode: "lines",
              type: "scatter",
              line: {
                color: color,
              },
              name: pseudo,
              hovertemplate:
                pseudo +
                `<br>Volume = %{x:.${hoverDigits}f} Å³/atom` +
                `<br>Energy = %{y:.${hoverDigits}f} eV/atom` +
                "<extra></extra>",
              hoverlabel: { align: "left" },
            };
          }
        });

      const layout: Partial<Layout> = {
        title: { text: formatSubscripts(configuration), x: 0.55, y: 0.9 },
        xaxis: {
          title: { text: "Volume [Å³/atom]", standoff: 10 },
          showgrid: false,
        },
        yaxis: { title: { text: "Energy [eV/atom]" }, showgrid: false },
        showlegend: false,
        margin: { l: 70, r: 20, t: 30, b: 40 },
        autosize: true,
      };

      graphDiv = (await Plotly.react(
        plotRef.current,
        data,
        layout,
        config,
      )) as PlotlyHTMLElement;

      const handleResize = (gd: PlotlyHTMLElement) => {
        if (!gd) return;
        Plotly.Plots.resize(gd);
      };

      resizeHandler = () => handleResize(graphDiv!);
      window.addEventListener("resize", resizeHandler);
      resizeHandler();
    })();

    return () => {
      destroyed = true;
      if (resizeHandler) window.removeEventListener("resize", resizeHandler);
      if (Plotly && graphDiv) {
        try {
          Plotly.purge(graphDiv);
        } catch (error) {
          console.error("Error purging EosPlot:", error);
        }
      }
    };
  }, [activePseudos]);

  return <div ref={plotRef} className={styles["eos-plot"]}></div>;
};

export default EosPlot;
