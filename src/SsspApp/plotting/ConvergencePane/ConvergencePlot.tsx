import { useContext, useEffect, useMemo, useRef, useState } from "react";

import type { Config, PlotlyHTMLElement } from "plotly.js";

import { ElementContext, LibraryContext } from "@sssp/context";

import { ConvergencePlotProps } from "./ConvergencePlot.models";
import styles from "./ConvergencePlot.module.scss";
import UpfModal from "./UpfModal";
import {
  CONVERGENCE_X_MAX,
  CONVERGENCE_X_MIN,
  CONVERGENCE_X_WINDOW_RY,
  generateConvergencePlotData,
} from "./utils";

const config: Partial<Config> = {
  responsive: false,
  displayModeBar: false,
  displaylogo: false,
  scrollZoom: false,
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const getEventXRange = (event: unknown): { x0: number; x1: number } | null => {
  if (!event || typeof event !== "object") return null;

  const e = event as Record<string, unknown>;

  const rangeArray = e["xaxis.range"];
  if (Array.isArray(rangeArray) && rangeArray.length >= 2) {
    const x0 = Number(rangeArray[0]);
    const x1 = Number(rangeArray[1]);
    if (Number.isFinite(x0) && Number.isFinite(x1)) return { x0, x1 };
  }

  const x0 = Number(e["xaxis.range[0]"]);
  const x1 = Number(e["xaxis.range[1]"]);
  if (Number.isFinite(x0) && Number.isFinite(x1)) return { x0, x1 };

  return null;
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

      // Always allow x-panning, but clamp it to the [min,max] data bounds.
      // Also keep a fixed window size (default 70 Ry) even after double-click resets.
      graphDiv.removeAllListeners?.("plotly_relayout");
      graphDiv.on("plotly_relayout", async (event: unknown) => {
        if (!Plotly || !graphDiv) return;

        const nextRange = getEventXRange(event);
        const windowSize = CONVERGENCE_X_WINDOW_RY;

        // If Plotly tries to autorange/reset, force our fixed window.
        if (!nextRange) {
          await Plotly.relayout(graphDiv, {
            "xaxis.range": [CONVERGENCE_X_MIN, CONVERGENCE_X_MIN + windowSize],
          });
          return;
        }

        const raw0 = Math.min(nextRange.x0, nextRange.x1);
        const raw1 = Math.max(nextRange.x0, nextRange.x1);
        const currentWindow = raw1 - raw0;

        const desiredWindow =
          Number.isFinite(currentWindow) && currentWindow > 0
            ? currentWindow
            : windowSize;

        const maxStart = CONVERGENCE_X_MAX - desiredWindow;
        const clamped0 = clamp(raw0, CONVERGENCE_X_MIN, maxStart);
        const clamped1 = clamped0 + desiredWindow;

        const changed =
          Math.abs(clamped0 - raw0) > 1e-9 || Math.abs(clamped1 - raw1) > 1e-9;
        if (!changed) return;

        await Plotly.relayout(graphDiv, {
          "xaxis.range": [clamped0, clamped1],
        });
      });

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
      if (graphDiv) {
        graphDiv.removeAllListeners?.("plotly_clickannotation");
        graphDiv.removeAllListeners?.("plotly_relayout");
      }
    };
  }, [
    element,
    summaryData,
    libraries,
    recommendedPseudos,
    activePseudos,
    pseudosMetadata,
  ]);

  return (
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
