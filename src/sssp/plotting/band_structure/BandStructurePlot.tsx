import { useEffect, useRef } from "react";

import { BandsData, BandsPseudosMap } from "@sssp/models";

import BandStructurePlotProps from "./BandStructurePlot.models";
import styles from "./BandStructurePlot.module.scss";

const BandStructurePlot: React.FC<BandStructurePlotProps> = ({
  pseudosMetadata,
  bandsPseudosMap,
  activePseudos,
  bandShift,
}) => {
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      if (!bandsPseudosMap || !plotRef.current) return;

      const pseudosData = buildBandsData(
        activePseudos,
        bandsPseudosMap,
        bandShift,
        pseudosMetadata,
      );

      if (!pseudosData.length) return;

      let BandsVisualiser:
        | typeof import("bands-visualiser").BandsVisualiser
        | null = null;

      BandsVisualiser = (await import("bands-visualiser")).BandsVisualiser;

      BandsVisualiser(plotRef.current, {
        bandsDataArray: pseudosData,
        settings: {
          showlegend: false,
          yaxis: {
            range: [-20, 20],
          },
        },
      });
    })();
  }, [activePseudos, bandsPseudosMap, pseudosMetadata, bandShift]);

  return (
    <div id={styles["bands-plot-wrapper"]}>
      <div ref={plotRef} id={styles["bands-plot"]}></div>
    </div>
  );
};

export default BandStructurePlot;

const buildBandsData = (
  activePseudos: string[],
  bandsPseudosMap: BandsPseudosMap,
  bandShift: number,
  pseudosMetadata: Record<string, { color?: string }>,
) => {
  return activePseudos.flatMap((pseudo, index) => {
    const data = bandsPseudosMap[pseudo];
    if (!data) return [];

    let shift = -data.fermiLevel || 0.0;
    if (index === 1) shift += bandShift / 1000;

    return [
      {
        bandsData: shiftBandsData(data, shift),
        traceFormat: {
          line: {
            color:
              index === 0 ? "black" : pseudosMetadata[pseudo]?.color || "red",
          },
        },
      },
    ];
  });
};

const shiftBandsData = (bandsData: BandsData, shift: number): BandsData => {
  return {
    ...bandsData,
    paths: bandsData.paths.map((path) => ({
      ...path,
      values: path.values.map((point) => point.map((p) => p + shift)),
    })),
  };
};
