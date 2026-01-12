import { useContext, useEffect, useMemo, useRef, useState } from "react";

import type { Config } from "plotly.js";

import { LoadingSpinner, NoDataMessage } from "@sssp/components";
import { ElementsInfoContext, LibraryContext } from "@sssp/context";
import { PseudoConvergenceData } from "@sssp/models";
import { SsspDataService } from "@sssp/services";

import { ConvergencePlotProps } from "./ConvergencePlot.models";
import styles from "./ConvergencePlot.module.scss";
import UpfModal from "./UpfModal";
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
  const [summaryData, setSummaryData] = useState({} as PseudoConvergenceData);
  const [showUpfModal, setShowUpfModal] = useState(false);
  const [upfPseudoName, setUpfPseudoName] = useState("");
  const [upfZ, setUpfZ] = useState<number>();
  const plotRef = useRef<HTMLDivElement>(null);

  const activePseudos = useMemo(() => {
    if (!summaryData || !summaryData.pseudos) return [];
    return summaryData.pseudos
      .filter((pseudo) => pseudosMetadata.hasOwnProperty(pseudo.name))
      .reverse(); // reversed because we build it bottom-up in the plot
  }, [summaryData?.pseudos, pseudosMetadata]);

  const recommendedPseudos = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(elementsInfo).map(([library, infos]) => [
          library,
          infos[element],
        ])
      ),
    [elementsInfo, element]
  );

  useEffect(() => {
    if (!element) return;

    setLoadingData(true);
    setSummaryData({} as PseudoConvergenceData);

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

    let destroyed = false;

    (async () => {
      const Plotly = (await import("@sssp/plotting/PlotlyLoader")).default;

      if (destroyed || !plotRef.current) return;

      const { data, layout } = generateConvergencePlotData(
        element,
        summaryData.conff,
        libraries,
        recommendedPseudos,
        activePseudos,
        pseudosMetadata
      );

      await Plotly.react(plotRef.current, data, layout, config);

      const gd: any = plotRef.current;
      if (gd?.removeAllListeners) {
        gd.removeAllListeners("plotly_clickannotation");
      }

      if (gd?.on) {
        gd.on("plotly_clickannotation", async (event: any) => {
          const text: string = event?.annotation?.text || "";

          const pseudoMatch = text.match(/<b>(.*?)<\/b>/);
          const pseudo = pseudoMatch?.[1];
          if (!pseudo) return;

          const zMatch = text.match(/Z<sub>val<\/sub>\s*=\s*(\d+)/);
          const z = zMatch ? Number.parseInt(zMatch[1], 10) : NaN;
          if (!Number.isFinite(z)) return;

          setUpfPseudoName(pseudo);
          setUpfZ(z);
          setShowUpfModal(true);
        });
      }
    })();

    return () => {
      destroyed = true;
    };
  }, [
    loadingData,
    element,
    summaryData,
    libraries,
    recommendedPseudos,
    activePseudos,
    pseudosMetadata,
  ]);

  return loadingData ? (
    <LoadingSpinner />
  ) : !activePseudos.length ? (
    <NoDataMessage />
  ) : (
    <>
      <div ref={plotRef} id={styles["convergence-plot"]} />
      <UpfModal
        show={showUpfModal}
        element={element}
        pseudoName={upfPseudoName}
        Z={upfZ}
        onHide={() => setShowUpfModal(false)}
      />
    </>
  );
};

export default ConvergencePlot;
