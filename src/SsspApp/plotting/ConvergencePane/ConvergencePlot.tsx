import { useContext, useEffect, useMemo, useRef, useState } from "react";

import type { Config, PlotlyHTMLElement } from "plotly.js";

import { NoDataMessage } from "@sssp/components";
import { ElementContext, LibraryContext } from "@sssp/context";

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
  summaryData,
  pseudosMetadata,
}) => {
  const { libraries } = useContext(LibraryContext);
  const { elementsInfo } = useContext(ElementContext);
  const [showUpfModal, setShowUpfModal] = useState(false);
  const [upfPseudoName, setUpfPseudoName] = useState("");
  const [upfZ, setUpfZ] = useState<number>();
  const plotRef = useRef<HTMLDivElement>(null);

  const activePseudos = useMemo(() => {
    if (!summaryData || !summaryData.pseudos) return [];
    return summaryData.pseudos
      .filter((pseudo) => pseudosMetadata?.[pseudo.name])
      .reverse(); // reversed because we build it bottom-up in the plot
  }, [summaryData, pseudosMetadata]);

  const recommendedPseudos = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(elementsInfo).map(([library, infos]) => [
          library,
          infos[element],
        ]),
      ),
    [elementsInfo, element],
  );

  useEffect(() => {
    if (!activePseudos.length || !plotRef.current) {
      return;
    }

    let destroyed = false;
    let Plotly: typeof import("plotly.js") | null = null;
    let graphDiv: PlotlyHTMLElement | null = null;

    (async () => {
      Plotly = (await import("@sssp/plotting/PlotlyLoader")).default;

      if (destroyed || !plotRef.current) return;

      const { data, layout } = generateConvergencePlotData(
        element,
        libraries,
        recommendedPseudos,
        activePseudos,
        pseudosMetadata,
      );

      graphDiv = (await Plotly.react(
        plotRef.current,
        data,
        layout,
        config,
      )) as PlotlyHTMLElement;

      graphDiv.removeAllListeners?.("plotly_clickannotation");
      graphDiv.on("plotly_clickannotation", async (event: unknown) => {
        const annotationText =
          event && typeof event === "object" && "annotation" in event
            ? (event as { annotation?: { text?: unknown } }).annotation?.text
            : undefined;

        const text = typeof annotationText === "string" ? annotationText : "";
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
    })();

    return () => {
      destroyed = true;
      if (graphDiv) graphDiv.removeAllListeners?.("plotly_clickannotation");
    };
  }, [
    element,
    summaryData,
    libraries,
    recommendedPseudos,
    activePseudos,
    pseudosMetadata,
  ]);

  return !activePseudos.length ? (
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
