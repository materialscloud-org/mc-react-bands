# React Materials Cloud Band Structure Visualizer

A React component to visualize band structures and density of states (dos) on the Materials Cloud platform.

The `BandsVisualizer` component (only the folder `src/lib`) is published as a npm package, which can be installed via `npm install mc-react-bands`.

In order to use the library, the peer dependencies (see `package.json`) need to be installed separately in the consuming application. Additionally, the chart.js plugins need to be registered.

Basic usage is the following:

```JSX
import BandsVisualizer from "mc-react-bands";

import Si_bands from "./data/Si_bands.json";
import Si_dos from "./data/Si_dos.json";

// Chart.js plugins need to be registered outside the library
import Chart from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import annotationPlugin from "chartjs-plugin-annotation";
Chart.register(zoomPlugin);
Chart.register(annotationPlugin);

function App() {
  return (
    <BandsVisualizer
      bandsDataList={[Si_bands]}
      dosData={Si_dos}
      showFermi={true}
      showLegend={undefined}
      yLimit={{ ymin: -10.0, ymax: 10.0 }}
      dosRange={[]}
      colorInfo={undefined}
    />
  );
}
export default App;
```

This repository also contains example usage in the `src/App.jsx` file. `src/data` contains the data format of the band and dos files.

For local development, and running the example, just install and run this repository:

```
npm install
npm run dev
```

To publish a new version on npm:

```
npm run build
npm publish
```

The core of this app is based on `jquery` and `chart.js`.

Related repositories:

- https://github.com/materialscloud-org/bands-widget (original, outdated version used in legacy Materials Cloud)
- https://github.com/aiidalab/widget-bandsplot (corresponding AiiDAlab widget, that should be adapted to use this repository)
