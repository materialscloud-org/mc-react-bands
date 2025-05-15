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

// This now takes an array as an input -
// Perhaps confusingly this does not match the format of BSDOS...
// and currently doesnt allow color/legend labelling.
// can either handle color information on multi-data plots at the data level
// or as its own passable variable...
function parseBandsData(bandsData, labelPrefix = "") {
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

  // Optionally prefix trace names to distinguish sets
  traces.forEach((t) => {
    if (t.name) t.name = `${labelPrefix}${t.name}`;
    if (t.legendgroup) t.legendgroup = `${labelPrefix}${t.legendgroup}`;
  });

  return { traces, projectionCache, layout };
}

// Wrapped plotly obj for plotting in react
export function BandstructureReact({ bandsDataArray }) {
  const plotRef = useRef(null);
  const bandWidth = 1.0;

  let allTraces = [];
  let allProjectionTraces = [];

  let baseLayout = null;

  bandsDataArray.forEach((bandsData, index) => {
    const labelPrefix = "";
    const { traces, projectionCache, layout } = parseBandsData(
      bandsData,
      labelPrefix
    );

    allTraces.push(...traces);
    if (projectionCache) {
      const projectionTraces = buildProjectionTracesFromCache(
        projectionCache,
        bandWidth
      );
      allProjectionTraces.push(...projectionTraces);
    }

    // Use the first layout as base layout
    if (index === 0) baseLayout = layout;
  });

  const finalTraces = [...allTraces, ...allProjectionTraces];

  useEffect(() => {
    if (plotRef.current) {
      Plotly.newPlot(plotRef.current, finalTraces, baseLayout, {
        displaylogo: false,
      });
    }
  }, [finalTraces, baseLayout]);

  return <div ref={plotRef} style={{ width: "100%", height: "100%" }} />;
}

export default BandstructureReact;
