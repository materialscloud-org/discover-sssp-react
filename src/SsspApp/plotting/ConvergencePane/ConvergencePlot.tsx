import { useContext, useEffect, useMemo, useRef, useState } from "react";

import type { Config, PlotlyHTMLElement } from "plotly.js";

import { ElementContext, LibraryContext } from "@sssp/context";

import { ConvergencePlotProps } from "./ConvergencePlot.models";
import styles from "./ConvergencePlot.module.scss";
import UpfModal from "./UpfModal";
import {
  clampXRangeToDomain,
  computeXWindowSpanRyForPlotWidth,
  generateConvergencePlotData,
  getEventXRange,
  getGraphDivXRange,
  getMarginsForXWindowSpan,
  getPlotAreaWidthPx,
  isPlotlyXAutoRangeEvent,
  scheduleNextFrame,
  windowSize,
  xMax,
  xMin,
  XRange,
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
  // The x-range span (in Ry) currently used to keep tick spacing fixed in pixels.
  const xWindowSpanRyRef = useRef<number>(windowSize);

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
    let resizeObserver: ResizeObserver | null = null;

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

      // Resize-driven x-window (keeps tick spacing fixed in pixels)
      {
        const plotAreaWidthPx = getPlotAreaWidthPx(plotRef.current);
        xWindowSpanRyRef.current =
          computeXWindowSpanRyForPlotWidth(plotAreaWidthPx);

        const boundedRange = clampXRangeToDomain(
          { min: xMin, max: xMin + xWindowSpanRyRef.current },
          xWindowSpanRyRef.current,
        );

        await Plotly.relayout(graphDiv, {
          "xaxis.range": [boundedRange.min, boundedRange.max],
        });
      }

      resizeObserver = new ResizeObserver(async () => {
        if (!Plotly || !graphDiv) return;

        const plotAreaWidthPx = getPlotAreaWidthPx(plotRef.current);
        xWindowSpanRyRef.current =
          computeXWindowSpanRyForPlotWidth(plotAreaWidthPx);

        Plotly.Plots.resize(graphDiv);

        const currentRange =
          getGraphDivXRange(graphDiv) ??
          ({ min: xMin, max: xMin + xWindowSpanRyRef.current } as XRange);

        const centerRy = (currentRange.min + currentRange.max) * 0.5;
        const halfSpanRy = xWindowSpanRyRef.current * 0.5;

        const boundedRange = clampXRangeToDomain(
          { min: centerRy - halfSpanRy, max: centerRy + halfSpanRy },
          xWindowSpanRyRef.current,
        );

        await Plotly.relayout(graphDiv, {
          margin: getMarginsForXWindowSpan(xWindowSpanRyRef.current),
          "xaxis.range": [boundedRange.min, boundedRange.max],
        });
      });
      resizeObserver.observe(plotRef.current);

      // Allow x-panning, but clamp only when out of [xMin, xMax].
      // Also keep a fixed window size (default 70 Ry) after double-click resets.
      graphDiv.removeAllListeners?.("plotly_relayout");
      graphDiv.on("plotly_relayout", async (event: unknown) => {
        if (!Plotly || !graphDiv) return;

        // Plotly's double-click reset often comes through as `xaxis.autorange: true`.
        // In that case, we *always* want the window to start at xMin.
        if (isPlotlyXAutoRangeEvent(event)) {
          await Plotly.relayout(graphDiv, {
            "xaxis.range": [xMin, xMin + xWindowSpanRyRef.current],
          });
          return;
        }

        const nextRange = getEventXRange(event);

        // If Plotly tries to autorange/reset, force our fixed window.
        if (!nextRange) {
          await Plotly.relayout(graphDiv, {
            "xaxis.range": [xMin, xMin + xWindowSpanRyRef.current],
          });
          return;
        }

        const requestedRange = { min: nextRange.x0, max: nextRange.x1 };
        const span = requestedRange.max - requestedRange.min;
        const expectedSpan = xWindowSpanRyRef.current;
        if (
          requestedRange.min >= xMin &&
          requestedRange.max <= xMax &&
          Number.isFinite(span) &&
          Math.abs(span - expectedSpan) < 1e-6
        ) {
          return;
        }

        const bounded = clampXRangeToDomain(requestedRange, expectedSpan);

        await Plotly.relayout(graphDiv, {
          "xaxis.range": [bounded.min, bounded.max],
        });
      });

      // Belt-and-suspenders: some Plotly configs emit a separate doubleclick event.
      graphDiv.removeAllListeners?.("plotly_doubleclick");
      graphDiv.on("plotly_doubleclick", () => {
        if (!Plotly || !graphDiv) return;

        scheduleNextFrame(() => {
          void Plotly?.relayout(graphDiv as PlotlyHTMLElement, {
            "xaxis.range": [xMin, xMin + xWindowSpanRyRef.current],
          });
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
      resizeObserver?.disconnect();
      if (graphDiv) {
        graphDiv.removeAllListeners?.("plotly_clickannotation");
        graphDiv.removeAllListeners?.("plotly_doubleclick");
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
