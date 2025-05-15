import { plotBandLayout } from "../plotLayoutDefaults";
import deepmerge from "deepmerge";

// normalisetoFermi
export function normalise(ys, fermi) {
  return ys.map((band) =>
    band.map((val) => (val != null ? val - fermi : null))
  );
}

// formatting XY data: nulls exist across bound.
export function getXYData(bandData) {
  const xs = [];
  const ys = [];
  let lastX = null;

  bandData.paths.forEach((path, pathIndex) => {
    const pathX = path.x;
    const pathVals = path.values;

    if (pathIndex > 0) {
      xs.push(null);
      ys.forEach((yBand) => yBand.push(null));
    }

    pathX.forEach((xVal, i) => {
      if (xVal === lastX) {
        xs.push(null);
        ys.forEach((yBand) => yBand.push(null));
      }

      xs.push(xVal);
      lastX = xVal;

      pathVals.forEach((band, bIndex) => {
        if (!ys[bIndex]) ys[bIndex] = [];
        ys[bIndex].push(band[i]);
      });
    });
  });

  return { xs, ys };
}

// we cache the projection shape data to allow faster updates.
export function cacheProjectionData(xs, ys, projections) {
  const ysNoNull = ys.map((inner) => inner.filter((val) => val !== null));
  const xsNoNull = xs.filter((val) => val !== null);

  const cache = [];

  for (let p = 0; p < projections.length; p++) {
    for (let band = 0; band < ysNoNull.length; band++) {
      cache.push({
        xs: xsNoNull,
        ys: ysNoNull[band],
        weights: projections[p].weights[band],
        color: projections[p].color,
        label: `${projections[p].label} on band ${band}`,
        legendgroup: projections[p].label,
        showLegendLabel: band === 0,
      });
    }
  }
  return cache;
}

// build the plot data from the cache should reduce some recalculation
export function buildProjectionTracesFromCache(
  projectionCache,
  bandWidth = 0.5
) {
  return projectionCache.map((entry) => {
    const upper = entry.ys.map((val, i) => val + bandWidth * entry.weights[i]);
    const lower = entry.ys.map((val, i) => val - bandWidth * entry.weights[i]);

    return {
      x: [...entry.xs, ...entry.xs.slice().reverse()],
      y: [...upper, ...lower.slice().reverse()],
      type: "scatter",
      mode: "lines",
      fill: "toself",
      line: { color: "rgba(0,0,0,0)" },
      fillcolor: entry.color,
      name: entry.showLegendLabel ? entry.label : undefined,
      hoveron: "points",
      legendgroup: entry.legendgroup,
      showlegend: entry.showLegendLabel,
    };
  });
}

// uses x, ys and projections (with labels) to build bandstructure data
export function getBandStructure(
  xs,
  ys,
  fermiLine = 0,
  xLabels = [],
  xLabelPos = [],
  projections = null,
  spinResolved = false
) {
  let projectionCache;
  if (projections !== null) {
    console.log("Projection Data Found.");
    // cache projection cach
    projectionCache = cacheProjectionData(bandsData, projectedBandsData);
  }

  const lineTraces = new Array(ys.length + 1); // pre-size array
  lineTraces[0] = {
    x: [0, xLabelPos[xLabelPos.length - 1]],
    y: [fermiLine, fermiLine],
    mode: "lines",
    name: "Fermi-level",
    line: {
      color: "green",
      width: 2.0,
    },
  };

  ys.forEach((yVals, i) => {
    let name = `Band ${i + 1}`;
    let lineStyle = {
      color: "#111",
      width: 1.5,
    };
    let legendgroup = null;
    let legendgrouptitle = undefined;
    let showlegend = false;

    if (spinResolved) {
      const midIndex = ys.length / 2;
      const isDown = i < midIndex;
      const index = isDown ? i + 1 : i - midIndex + 1;

      name = `${isDown ? "↓" : "↑"}`;
      legendgroup = isDown ? "spin-down" : "spin-up";
      showlegend = index === 1;

      lineStyle = {
        color: "#111111",
        width: isDown ? 1.25 : 1.25,
        dash: isDown ? "solid" : "dot",
      };
    } else {
      legendgroup = "non-spin";
      showlegend = i === 0;
    }

    lineTraces[i + 1] = {
      hoverinfo: "none",
      x: xs,
      y: yVals,
      type: "scatter",
      mode: "lines",
      name,
      layer: "below",
      line: lineStyle,
      legendgroup,
      showlegend,
      connectgaps: false,
    };
  });

  // relabel the axis.
  const fullLayout = deepmerge.all([
    plotBandLayout,

    {
      xaxis: {
        tickvals: xLabelPos,
        ticktext: xLabels,
      },
      yaxis: {
        range: [-10.5, 10.5], // def Y
        autorange: false,
      },
    },
  ]);

  return {
    traces: [...lineTraces],
    projectionCache,
    layout: fullLayout,
  };
}

export default getBandStructure;
