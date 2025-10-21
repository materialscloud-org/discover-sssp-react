import React, { useEffect, useState } from "react";

import { LoadingSpinner } from "@sssp/components";

// This component dynamically imports a much smaller Plotly build
// (plotly.js-basic-dist) and uses react-plotly.js's factory to create a
// lightweight Plot component at runtime. This avoids bundling the full
// plotly library into the main chunk and reduces overall bundle size.

const PlotlyLoader: React.FC<any> = (props) => {
  const [PlotComponent, setPlotComponent] =
    useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    let mounted = true;
    // Import both factory and the smaller plotly build in parallel
    Promise.all([
      import("react-plotly.js/factory"),
      import("plotly.js-basic-dist"),
    ])
      .then(([factoryModule, plotly]) => {
        if (!mounted) return;
        const createPlotlyComponent =
          (factoryModule as any).default || (factoryModule as any);
        const Plot = createPlotlyComponent(plotly);
        setPlotComponent(() => Plot);
      })
      .catch((err) => {
        console.error("Failed to load Plotly:", err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (!PlotComponent) {
    return <LoadingSpinner />;
  }

  const C = PlotComponent;
  return <C {...props} />;
};

export default PlotlyLoader;
