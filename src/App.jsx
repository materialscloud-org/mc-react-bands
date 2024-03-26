import "./App.css";

import Co_bands from "./data/Co_bands.json";
import Co_bands_fast from "./data/Co_bands_fast.json";
import Si_bands from "./data/Si_bands.json";
import Si_dos from "./data/Si_dos.json";
import Fe_spin_bands_fast from "./data/Fe_spin_bands_fast.json";
import Fe_spin_dos_fast from "./data/Fe_spin_dos_fast.json";

import BandsVisualizer from "./lib";

import Chart from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import annotationPlugin from "chartjs-plugin-annotation";

Chart.register(zoomPlugin);
Chart.register(annotationPlugin);

function App() {
  var jsx1 = (
    <div className="center-div">
      <h3>Bands and DOS</h3>
      <div
        style={{
          width: "800px",
        }}
      >
        <BandsVisualizer
          bandsDataList={[Si_bands]}
          dosData={Si_dos}
          showFermi={true}
          showLegend={undefined}
          yLimit={{ ymin: -10.0, ymax: 10.0 }}
          dosRange={[]}
          colorInfo={undefined}
        />
      </div>
    </div>
  );

  var jsx2 = (
    <div className="center-div">
      <h3>Bands and DOS (spin-polarized)</h3>
      <div
        style={{
          width: "700px",
        }}
      >
        <span>test</span>
        <BandsVisualizer
          bandsDataList={[Fe_spin_bands_fast]}
          dosData={Fe_spin_dos_fast}
          showFermi={true}
          showLegend={undefined}
          yLimit={{ ymin: -10.0, ymax: 10.0 }}
          dosRange={[]}
          colorInfo={undefined}
        />
      </div>
    </div>
  );

  var jsx3 = (
    <div className="center-div">
      <h3>Just bands</h3>
      <div
        style={{
          width: "800px",
        }}
      >
        <BandsVisualizer
          bandsDataList={[Si_bands]}
          dosData={null}
          showFermi={true}
          showLegend={undefined}
          yLimit={{ ymin: -10.0, ymax: 10.0 }}
          dosRange={[]}
          colorInfo={undefined}
        />
      </div>
    </div>
  );

  var jsx4 = (
    <div className="center-div">
      <h3>Just DOS</h3>
      <div
        style={{
          width: "600px",
        }}
      >
        <BandsVisualizer
          bandsDataList={[]}
          dosData={Si_dos}
          showFermi={true}
          showLegend={undefined}
          yLimit={{ ymin: -10.0, ymax: 10.0 }}
          dosRange={[]}
          colorInfo={undefined}
        />
      </div>
    </div>
  );

  return (
    <div className="App">
      {jsx1}
      {jsx2}
      {jsx3}
      {jsx4}
    </div>
  );
}

export default App;
