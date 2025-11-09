import { useEffect, useRef } from "react";

import type { Config, Data, Layout } from "plotly.js";

import { EosPlotData } from "@sssp/models";

import EosPlotProps from "./EosPlot.models";
import styles from "./EosPlot.module.scss";

const refRes = 1000;
const hoverDigits = 2;
const hoverTemplate = `(%{x:.${hoverDigits}f}, %{y:.${hoverDigits}f})`;

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

const BM = (V: number[], V0: number, E0: number, B0: number, B1: number) =>
  V.map((v) => {
    const eta = Math.pow(v / V0, 2 / 3);
    return (
      E0 +
      ((9 * B0 * V0) / 16) *
        (Math.pow(eta - 1, 3) * B1 + Math.pow(eta - 1, 2) * (6 - 4 * eta))
    );
  });

const EosPlot: React.FC<EosPlotProps> = ({
  configuration,
  eosPseudosMap,
  pseudosColormap,
  activePseudos,
}) => {
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!plotRef.current) return;

    const volumes = Object.values(eosPseudosMap).flatMap(
      (eosData) => eosData.volumes || []
    );
    const minVolume = Math.min(...volumes);
    const maxVolume = Math.max(...volumes);

    const data: Data[] = Object.entries(eosPseudosMap)
      .filter(([pseudo]) => activePseudos.includes(pseudo))
      .map(([pseudo, eosData]: [string, EosPlotData]) => {
        if (pseudo !== "REF" && eosData.volumes && eosData.energies) {
          const sorted = eosData.volumes
            .map((volume: number, i: number) => ({
              volume,
              energy: (eosData.energies?.[i] || 0.0) - (eosData?.E0 || 0.0),
            }))
            .sort(
              (a: { volume: number }, b: { volume: number }) =>
                a.volume - b.volume
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
            marker: { color: pseudosColormap[pseudo] },
            hovertemplate:
              hoverTemplate +
              `<br>\u03BD = ${eosData.nu?.toFixed(hoverDigits)}`,
            hoverlabel: { align: "left" },
          };
        } else {
          const x = Array.from(
            { length: refRes },
            (_, i) => minVolume + (i * (maxVolume - minVolume)) / (refRes - 1)
          );
          return {
            x,
            y: BM(x, eosData.V0, 0, eosData.B0, eosData.B1),
            mode: "lines",
            type: "scatter",
            line: { color: pseudosColormap[pseudo] },
            name: pseudo,
            hovertemplate: hoverTemplate,
          };
        }
      });

    const layout: Partial<Layout> = {
      title: { text: configuration, x: 0.45 },
      xaxis: { title: { text: "Volume [Å³/atom]" }, showgrid: false },
      yaxis: { title: { text: "Energy [eV/atom]" }, showgrid: false },
      showlegend: false,
      margin: { l: 70, r: 20, t: 30, b: 60 },
      autosize: true,
    };

    let Plotly: any | null = null;

    (async () => {
      Plotly = (await import("@sssp/plotting/PlotlyLoader")).default;
      Plotly.react(plotRef.current, data, layout, config);

      const handleResize = () => Plotly.Plots.resize(plotRef.current!);
      window.addEventListener("resize", handleResize);
      handleResize();
    })();

    return () => {
      plotRef.current && Plotly && Plotly.purge(plotRef.current);
    };
  }, [activePseudos]);

  return <div ref={plotRef} className={styles["eos-plot"]}></div>;
};

export default EosPlot;
