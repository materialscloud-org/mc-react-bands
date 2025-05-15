import React, { useEffect, useRef } from "react";
import Plotly from "plotly.js-dist";
import { createDOSPlot } from "./dos";

export function DOSReact({ dosData, orient = "h" }) {
  const plotRef = useRef(null);

  console.log(dosData);
  const { traces, layout } = createDOSPlot(dosData, orient);

  // Effect to initialize the plot once the component mounts
  useEffect(() => {
    // Make sure the plot container is available
    if (plotRef.current) {
      // Create the Plotly plot
      Plotly.newPlot(plotRef.current, traces, layout);

      // Cleanup function to remove the plot when the component is unmounted
      return () => {
        Plotly.purge(plotRef.current);
      };
    }
  }, [traces, layout]); // Rerun the effect if the data changes

  return <div ref={plotRef} style={{ width: "100%", height: "100%" }} />;
}

export default DOSReact;
