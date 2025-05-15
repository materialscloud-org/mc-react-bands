import React, { useEffect, useRef } from "react";
import Plotly from "plotly.js-dist";

import { plotCombinedLayout } from "../plotLayoutDefaults";

import {
  getBandStructure,
  buildProjectionTracesFromCache,
  getXYData,
  normalise,
} from "../reactBands/bandstructure";

import {
  getXLabelPos,
  prettifyLabels,
  getXLabelsfromkpath,
} from "../reactBands/bandXlabels";

import createDOSPlot from "../reactDOS/dos";

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

export function CombinedBandDosPlot({ bandsData, dosData }) {
  const plotRef = useRef(null);

  useEffect(() => {
    if (!plotRef.current) return;

    const bandResult = parseBandsData(bandsData);
    const dosResult = createDOSPlot(dosData, "v");

    const bandTraces = bandResult.traces.map((trace) => ({
      ...trace,
      xaxis: "x1",
      yaxis: "y1",
    }));

    const dosTraces = dosResult.traces.map((trace) => ({
      ...trace,
      xaxis: "x2",
      yaxis: "y1",
    }));

    const data = [...bandTraces, ...dosTraces];
    const layout = {
      grid: {
        rows: 1,
        columns: 2,
        subplots: [["xy", "x2y"]],
      },
      xaxis: {
        ...bandResult.layout.xaxis,
        domain: [0, 0.65], // explicitly control width
      },
      yaxis: {
        ...bandResult.layout.yaxis,
        domain: [0, 1],
      },
      xaxis2: {
        ...dosResult.layout.xaxis,
        domain: [0.72, 1],
        anchor: "y",
      },
      showlegend: true,
      shapes: [
        {
          type: "rect",
          xref: "paper",
          yref: "paper",
          x0: 0,
          y0: 0,
          x1: 0.65,
          y1: 1.0,
          line: {
            color: "green",
            width: 2,
          },
          layer: "above",
        },
        {
          type: "rect",
          xref: "paper",
          yref: "paper",
          x0: 0.72,
          y0: 0,
          x1: 1.0,
          y1: 1.0,
          line: {
            color: "green",
            width: 2,
          },
          layer: "above",
        },
      ],
    };

    Plotly.newPlot(plotRef.current, data, layout, { displaylogo: false });

    return () => Plotly.purge(plotRef.current);
  }, [bandsData, dosData]);

  return <div ref={plotRef} style={{ width: "100%", height: "100%" }} />;
}

export default CombinedBandDosPlot;
