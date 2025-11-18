import { useContext, useEffect, useMemo, useRef, useState } from "react";

import type { Config, PlotlyHTMLElement } from "plotly.js";

import { LoadingSpinner, NoDataMessage } from "@sssp/components";
import { ElementsInfoContext, LibraryContext } from "@sssp/context";
import { ElementInfo, PseudoConvergenceData } from "@sssp/models";
import { SsspDataService } from "@sssp/services";

import { ConvergencePlotProps } from "./ConvergencePlot.models";
import styles from "./ConvergencePlot.module.scss";
import { generateConvergencePlotData } from "./utils";

const config: Partial<Config> = {
  responsive: true,
  displayModeBar: false,
  displaylogo: false,
};

const ConvergencePlot: React.FC<ConvergencePlotProps> = ({
  element,
  pseudosMetadata,
}) => {
  const [loadingData, setLoadingData] = useState(true);
  const { libraries } = useContext(LibraryContext);
  const { elementsInfo } = useContext(ElementsInfoContext);
  const [summaryData, setSummaryData] = useState<PseudoConvergenceData>(
    {} as PseudoConvergenceData
  );
  const plotRef = useRef<HTMLDivElement>(null);

  const activePseudos = useMemo(() => {
    if (!summaryData || !summaryData.pseudos) return [];
    return summaryData.pseudos.filter((pseudo) =>
      pseudosMetadata.hasOwnProperty(pseudo.name)
    );
  }, [summaryData, pseudosMetadata]);

  const recommendedPseudos = useMemo(() => {
    if (!element || !elementsInfo) return {};
    const recommended: { [key: string]: ElementInfo } = {};
    for (const key of Object.keys(elementsInfo)) {
      const elementInfo = elementsInfo[key];
      if (elementInfo && elementInfo[element]) {
        recommended[key] = elementInfo[element];
      }
    }
    return recommended;
  }, [elementsInfo, element]);

  useEffect(() => {
    setLoadingData(true);
    SsspDataService.fetchPseudosSummaryData(element)
      .then((data) => {
        setSummaryData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setSummaryData({} as PseudoConvergenceData);
      })
      .finally(() => {
        setLoadingData(false);
      });
  }, [element]);

  useEffect(() => {
    if (loadingData || !activePseudos.length || !plotRef.current) {
      return;
    }

    let Plotly: any | null = null;
    let destroyed = false;
    let graphDiv: any | null = null;

    (async () => {
      Plotly = (await import("@sssp/plotting/PlotlyLoader")).default;

      if (destroyed || !plotRef.current) return;

      const { data, layout } = generateConvergencePlotData(
        element,
        summaryData.conff,
        libraries,
        recommendedPseudos,
        activePseudos,
        pseudosMetadata
      );

      graphDiv = (await Plotly.react(
        plotRef.current,
        data,
        layout,
        config
      )) as PlotlyHTMLElement;
    })();

    return () => {
      destroyed = true;
      if (Plotly && graphDiv) {
        try {
          Plotly.purge(graphDiv);
        } catch (error) {
          console.error("Error purging ConvergencePlot:", error);
        }
      }
    };
  }, [loadingData, activePseudos, pseudosMetadata]);

  return loadingData ? (
    <LoadingSpinner />
  ) : !activePseudos.length ? (
    <NoDataMessage />
  ) : (
    <div ref={plotRef} id={styles["convergence-plot"]}></div>
  );
};

export default ConvergencePlot;
