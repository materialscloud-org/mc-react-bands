// default layouts - use deepmerge to spread without overwrites.
import deepmerge from "deepmerge";

export const plotLayoutDefault = {
  title: "Multi Trace Plot with border",
  hovermode: "closest", // or 'x unified'
  shapes: [
    {
      type: "rect",
      xref: "paper",
      yref: "paper",
      x0: 0,
      y0: 0,
      x1: 1,
      y1: 1,
      line: {
        color: "black",
        width: 2,
      },
      layer: "above",
    },
  ],
  margin: { l: 55, r: 10, t: 10, b: 45 },
  dragmode: "zoom",
  xaxis: {
    title: {
      text: "x-axis",
      font: {
        size: 18,
        color: "#212529",
      },
    },
    showgrid: true,
    showline: false,
    zeroline: false,
    ticks: "inside",
    tickfont: {
      size: 16,
      color: "#212529",
    },
  },
  yaxis: {
    title: {
      text: "y-axis",
      font: {
        size: 19,
        color: "#212529",
      },
    },
    showgrid: true,
    zeroline: false,
    showline: false,
    ticks: "inside",
    color: "#212529",
    tickfont: {
      color: "#212529",
      size: 19,
    },
  },
  legend: {
    x: 1.02, // Slightly outside the plot area
    y: 0.95,
    xanchor: "left", // Anchor legend box to its left edge
    yanchor: "top",
    orientation: "v",
  },
};

// using deepmerge to keep constants
export const plotBandLayout = deepmerge(plotLayoutDefault, {
  title: "BSPlot",
  xaxis: {
    title: {
      text: "K-path",
      font: {
        size: 18,
        color: "#212529",
      },
    },
    showgrid: true,
    showline: false,
    zeroline: false,
    ticks: "inside",
    tickfont: {
      size: 16,
      color: "#212529",
    },
  },
  yaxis: {
    title: {
      text: "Energy - E<sub>Fermi</sub> [eV]",
      font: {
        size: 19,
        color: "#212529",
      },
    },
    showgrid: true,
    zeroline: false,
    showline: false,
    ticks: "inside",
    color: "#212529",
    tickfont: {
      color: "#212529",
      size: 19,
    },
  },
});

export const plotDOSLayout = deepmerge(plotLayoutDefault, {
  title: "DOSPlot",
  xaxis: {
    title: {
      text: "Energy [eV]",
      font: {
        size: 18, // Font size of the title
        color: "#212529", // Matches heading colors
      },
    },
    showgrid: true,
    zeroline: false,
    ticks: "inside",
    tickfont: {
      size: 16,
      color: "#212529",
    },
  },
  yaxis: {
    title: {
      text: "Density of States",
      font: {
        size: 18, // Font size of the title
        color: "#212529", // Matches heading colors
      },
    },
    showgrid: true,
    zeroline: false,
    ticks: "inside",
    tickfont: {
      size: 16,
      color: "#212529",
    },
  },
});

export const plotDOSLayoutF = deepmerge(plotLayoutDefault, {
  title: "DOSPlot",
  xaxis: {
    title: {
      text: "Density of States",
      font: {
        size: 18, // Font size of the title
        color: "#212529", // Matches heading colors
      },
    },
    showgrid: true,
    zeroline: false,
    ticks: "inside",
    tickfont: {
      size: 16,
      color: "#212529",
    },
  },
  yaxis: {
    title: {
      text: "Energy [eV]",
      font: {
        size: 18, // Font size of the title
        color: "#212529", // Matches heading colors
      },
    },
    showgrid: true,
    zeroline: false,
    ticks: "inside",
    tickfont: {
      size: 16,
      color: "#212529",
    },
  },
});

export const plotCombinedLayout = {
  doubleclick: false,
  title: "Combined Plot",
  grid: {
    rows: 1,
    columns: 2,
    pattern: "coupled",
  },
  xaxis: {
    title: "x1",
  },
  yaxis: {
    title: "y1",
  },
  xaxis2: {
    title: "x2",
    title: {
      text: "DOS",
      font: {
        size: 18, // Font size of the title
        color: "#212529", // Matches heading colors
      },
    },
  },
  yaxis2: {
    title: "y2",
    matches: "y",
  },
  dragmode: "zoom",
};

//
export const plotdHvALayout = {
  title: "Multiple Paths Plot",
  // Rectangle for outside border of plot.
  shapes: [
    {
      type: "rect",
      x0: 0,
      y0: 0,
      x1: 1,
      y1: 1,
      line: {
        color: "black",
        width: 1.25,
      },
      xref: "paper",
      yref: "paper",
    },
  ],
  dragmode: "pan",

  xaxis: {
    title: {
      text: "Rotation angle, φ [degrees]",
      font: {
        size: 18, // Font size of the title
        color: "#212529", // Matches heading colors
      },
    },
    showgrid: true,
    showline: false, // Hide x-axis line
    zeroline: false,
    ticks: "inside",
    fixedrange: true, // no scrolling.,
    tickfont: {
      size: 16,
      color: "#212529",
    },
  },
  yaxis: {
    title: {
      text: "dHvA frequency, kT",
      font: {
        size: 19,
        color: "#212529",
      },
    },
    showgrid: true,
    zeroline: false,
    showline: false,
    ticks: "inside",
    color: "#212529",
    tickfont: {
      color: "#212529",
      size: 19,
    },
  },
};
