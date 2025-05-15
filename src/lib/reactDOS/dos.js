import deepmerge from "deepmerge";
import { plotDOSLayout, plotDOSLayoutF } from "../plotLayoutDefaults";
import tinycolor from "tinycolor2";

// todo
export function normalise() {
  return;
}

// Its easier in plotly to use a RGBA format.
// TODO synchronize random DOS colors with
// malformed color info in projected bands?
function getRGBA(color) {
  const tc = tinycolor(color);
  if (!tc.isValid()) {
    // Generate random color with alpha 0.4 and 0.2
    const randomColor = tinycolor.random().toRgb();
    const randomBg = { ...randomColor, a: 0.2 };
    const randomBor = { ...randomColor, a: 0.1 };

    return [
      tinycolor(randomBg).toRgbString(),
      tinycolor(randomBor).toRgbString(),
    ];
  }

  const rgbBor = tc.toRgb();
  const rgbBg = tc.toRgb();

  rgbBor.a = 0.5;
  rgbBg.a = 0.3;

  return [tinycolor(rgbBg).toRgbString(), tinycolor(rgbBor).toRgbString()];
}

function changeAlpha(color, amount) {}

// helper function to look at the inital render window and determine a reasonable scale.
export function getGoodRange(traces, window, axis = "y") {
  const [minVal, maxVal] = window;
  const primary = axis; // "y" or "x"
  const secondary = axis === "y" ? "x" : "y";

  const valuesInWindow = traces
    .flatMap((trace) =>
      trace[secondary].map((secVal, i) => ({
        primaryVal: trace[primary][i],
        secVal,
      }))
    )
    .filter(
      (point) =>
        point.secVal >= minVal &&
        point.secVal <= maxVal &&
        Number.isFinite(point.primaryVal)
    )
    .map((point) => point.primaryVal);

  if (valuesInWindow.length === 0) return [0, 1]; // fallback

  let rangeMin = Math.min(...valuesInWindow);
  if (rangeMin >= 0) rangeMin = 0; // floor to 0 only if all data is above 0
  let rangeMax = Math.max(...valuesInWindow);

  return [rangeMin, rangeMax];
}

export function createDOSPlot(dosData, orient = "h") {
  const traces = [];
  dosData.dos.forEach((d, index) => {
    const colors = getRGBA(d.backgroundColor);
    // always shift by fermi level
    const fermiLevel = dosData.fermi_energy || 0;
    const shiftedX = d.x.map((x) => x - fermiLevel);

    // xy swap (for orient)
    const xValues = orient === "v" ? d.y : shiftedX;
    const yValues = orient === "v" ? shiftedX : d.y;

    const trace = {
      type: "scatter",
      mode: "lines",
      name: d.label,
      x: xValues,
      y: yValues,
      fill: "toself",
      fillcolor: colors[0],
      marker: { color: colors[1] },
      visible: true, // invis traces
      line: {
        width: 1,
        color: colors[1],
      },
    };
    traces.push(trace);
  });

  // flipped axis here.
  let layoutDOS;
  let axisToFilter;
  let primaryAxisKey;
  let secondaryAxisKey;

  const goodRange = getGoodRange(traces, [-10, 10], axisToFilter);

  if (orient === "v") {
    // flipped axis.
    layoutDOS = plotDOSLayoutF;
    axisToFilter = "x";
    primaryAxisKey = "yaxis";
    secondaryAxisKey = "xaxis";
  } else {
    layoutDOS = plotDOSLayout;
    axisToFilter = "y";
    primaryAxisKey = "yaxis";
    secondaryAxisKey = "xaxis";
  }

  const fullLayout = deepmerge.all([
    layoutDOS,
    {
      xaxis: layoutDOS.xaxis ? { ...layoutDOS.xaxis } : undefined,
      yaxis: layoutDOS.yaxis ? { ...layoutDOS.yaxis } : undefined,
      [primaryAxisKey]: {
        ...(layoutDOS[primaryAxisKey] || {}),
        range: goodRange,
        autorange: false,
      },
      [secondaryAxisKey]: {
        range: [-10.5, 10.5],
      },
    },
  ]);

  return {
    traces: traces,
    layout: fullLayout,
  };
}

export default createDOSPlot;
