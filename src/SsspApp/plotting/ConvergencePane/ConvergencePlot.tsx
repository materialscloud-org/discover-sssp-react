import { useContext, useEffect, useMemo, useRef, useState } from "react";

import type { Config, PlotlyHTMLElement } from "plotly.js";

import { ElementContext, LibraryContext } from "@sssp/context";

import { ConvergencePlotProps } from "./ConvergencePlot.models";
import styles from "./ConvergencePlot.module.scss";
import UpfModal from "./UpfModal";
import {
  generateConvergencePlotData,
  getEventXRange,
  windowSize,
  xMax,
  xMin,
} from "./utils";

const config: Partial<Config> = {
  responsive: true,
  displayModeBar: false,
  displaylogo: false,
  scrollZoom: false,
  showAxisDragHandles: false,
};

const ConvergencePlot: React.FC<ConvergencePlotProps> = ({
  element,
  activePseudos,
  pseudosMetadata,
}) => {
  const { libraries } = useContext(LibraryContext);
  const { elementsInfo } = useContext(ElementContext);
  const [showUpfModal, setShowUpfModal] = useState(false);
  const [upfPseudoName, setUpfPseudoName] = useState("");
  const [upfZ, setUpfZ] = useState<number>();
  const plotRef = useRef<HTMLDivElement>(null);

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

      // Allow x-panning, but clamp only when out of [xMin, xMax].
      // Also keep a fixed window size (default 70 Ry) after double-click resets.
      graphDiv.removeAllListeners?.("plotly_relayout");
      graphDiv.on("plotly_relayout", async (event: unknown) => {
        if (!Plotly || !graphDiv) return;

        const nextRange = getEventXRange(event);

        // If Plotly tries to autorange/reset, force our fixed window.
        if (!nextRange) {
          await Plotly.relayout(graphDiv, {
            "xaxis.range": [xMin, xMax],
          });
          return;
        }

        let newMin = nextRange.x0;
        let newMax = nextRange.x1;

        if (newMin >= xMin && newMax <= xMax) return;

        if (newMin < xMin) {
          newMin = xMin;
          newMax = xMin + windowSize;
        } else if (newMax > xMax) {
          newMax = xMax;
          newMin = xMax - windowSize;
        }

        await Plotly.relayout(graphDiv, {
          "xaxis.range": [newMin, newMax],
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
  }, [element, libraries, recommendedPseudos, activePseudos, pseudosMetadata]);

  return (
    <>
      <div ref={plotRef} id={styles.convergencePlot} />
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
