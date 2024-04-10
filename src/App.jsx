import React, { useState } from "react";

import "./App.css";

import co_bands_fast from "./exampleData/co_bands_fast.json";
import si_bands from "./exampleData/si_bands.json";
import si_dos from "./exampleData/si_dos.json";
import si_bands_shifted from "./exampleData/si_bands_shifted.json";
import fe_spin_bands_fast from "./exampleData/fe_spin_bands_fast.json";
import fe_spin_dos_fast from "./exampleData/fe_spin_dos_fast.json";

import BandsVisualizer from "./lib";

import Chart from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import annotationPlugin from "chartjs-plugin-annotation";

Chart.register(zoomPlugin);
Chart.register(annotationPlugin);

function App() {
  const [bandsDataList, setBandsDataList] = useState([
    si_bands,
    si_bands_shifted,
  ]);

  const updateWidget = () => {
    setBandsDataList([co_bands_fast]);
  };

  var jsx1 = (
    <div className="center-div">
      <h3>Bands (x2) and DOS</h3>
      <div
        style={{
          width: "800px",
        }}
      >
        <BandsVisualizer
          bandsDataList={bandsDataList}
          dosData={si_dos}
          energyRange={[-5.0, 5.0]}
          dosRange={[0.0, 2.0]}
          bandsColorInfo={["green", "red"]}
          formatSettings={{
            bandsYlabel: "Electronic bands (eV)",
            showFermi: true,
            showLegend: true,
          }}
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
          energyRange={[-10.0, 10.0]}
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
          energyRange={[-10.0, 10.0]}
          bandsColorInfo={["red"]}
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
          dosData={si_dos}
          energyRange={[-7.0, 7.0]}
          dosRange={[0.0, 2.0]}
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
