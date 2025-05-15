import React, { useEffect, useRef, useState } from "react";
import Plotly from "plotly.js-dist";

import {
  getBandStructure,
  buildProjectionTracesFromCache,
  getXYData,
  normalise,
} from "./bandstructure";

import {
  getXLabelPos,
  prettifyLabels,
  getXLabelsfromkpath,
} from "./bandXlabels";

function parseBandsData(bandsData) {
  const { xs, ys } = getXYData(bandsData);
  const ysShifted = normalise(ys, bandsData.fermi_level);

  const splitLabels = getXLabelsfromkpath(bandsData.path);
  const xLabels = splitLabels.map(prettifyLabels);
  const xLabelsPos = getXLabelPos(bandsData.paths);

  const { traces, projectionCache, layout } = getBandStructure(
    xs,
    ysShifted,
    bandsData.fermi_energy,
    xLabels,
    xLabelsPos,
    bandsData.projections,
    bandsData.paths[0].two_band_types
  );
  return { traces, projectionCache, layout };
}

// Wrapped plotly obj for plotting in react
export function BandstructureReact({ bandsData }) {
  const plotRef = useRef(null);
  console.log(bandsData);

  const { traces, projectionCache, layout } = parseBandsData(bandsData);

  const bandWidth = 1.0;

  let finalTraces = [...traces];
  if (projectionCache) {
    const projectionTraces = buildProjectionTracesFromCache(
      projectionCache,
      bandWidth
    );
    finalTraces = [...traces, ...projectionTraces];
  }

  // Initial render
  useEffect(() => {
    if (plotRef.current) {
      Plotly.newPlot(plotRef.current, finalTraces, layout, {
        displaylogo: false,
      });
    }
  }, [finalTraces, layout]);

  return <div ref={plotRef} style={{ width: "100%", height: "100%" }} />;
}

export default BandstructureReact;
