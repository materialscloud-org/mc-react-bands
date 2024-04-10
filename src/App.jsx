import React, { useState } from "react";

import "./App.css";

import co_bands_fast from "./exampleData/co_bands_fast.json";
import si_bands from "./exampleData/si_bands.json";
import si_dos from "./exampleData/si_dos.json";
import fe_spin_bands_fast from "./exampleData/fe_spin_bands_fast.json";
import fe_spin_dos_fast from "./exampleData/fe_spin_dos_fast.json";

import BandsVisualizer from "./lib";

import Chart from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import annotationPlugin from "chartjs-plugin-annotation";

Chart.register(zoomPlugin);
Chart.register(annotationPlugin);

function App() {
  const [yLimit, setYLimit] = useState({ ymin: -10.0, ymax: 10.0 });
  const [bandsData, setBandsData] = useState([si_bands]);

  const updateWidget = () => {
    //setYLimit({ ymin: 0.0, ymax: 10.0 });
    setBandsData([co_bands_fast]);
  };

  var jsx1 = (
    <div className="center-div">
      <h3>Bands and DOS</h3>
      <div
        style={{
          width: "800px",
        }}
      >
        <BandsVisualizer
          bandsDataList={bandsData}
          dosData={si_dos}
          showFermi={true}
          showLegend={undefined}
          yLimit={yLimit}
          dosRange={[]}
          colorInfo={undefined}
          formatSettings={{ bands_ylabel: "Electronic bands (eV)" }}
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
          bandsDataList={[fe_spin_bands_fast]}
          dosData={fe_spin_dos_fast}
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
          bandsDataList={[si_bands]}
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
          dosData={si_dos}
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
      <button onClick={updateWidget}>update</button>
      {jsx1}
      {jsx2}
      {jsx3}
      {jsx4}
    </div>
  );
}

export default App;
