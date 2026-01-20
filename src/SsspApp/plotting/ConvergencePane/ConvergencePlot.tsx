import { useContext, useEffect, useMemo, useRef, useState } from "react";

import type { Config } from "plotly.js";

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
      .filter((pseudo) => pseudosMetadata.hasOwnProperty(pseudo.name))
      .reverse(); // reversed because we build it bottom-up in the plot
  }, [summaryData?.pseudos, pseudosMetadata]);

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

    (async () => {
      const Plotly = (await import("@sssp/plotting/PlotlyLoader")).default;

      if (destroyed || !plotRef.current) return;

      const { data, layout } = generateConvergencePlotData(
        element,
        libraries,
        recommendedPseudos,
        activePseudos,
        pseudosMetadata,
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
