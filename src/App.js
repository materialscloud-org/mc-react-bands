import "./App.css";

import Co_bands from "./data/Co_bands.json";
import Co_bands_fast from "./data/Co_bands_fast.json";
import Si_bands from "./data/Si_bands.json";
import Si_dos from "./data/Si_dos.json";
import Fe_spin_bands_fast from "./data/Fe_spin_bands_fast.json";
import Fe_spin_dos_fast from "./data/Fe_spin_dos_fast.json";

import BandsVisualizer from "./BandsVisualizer";

function App() {
  // Make multiple bandplots
  var jsx1 = (
    <div>
      <h3>Bands and DOS (spin-polarized)</h3>
      <BandsVisualizer
        bandsDataList={[Fe_spin_bands_fast]}
        dosData={Fe_spin_dos_fast}
        showFermi={true}
        showLegend={undefined}
        yLimit={{ ymin: -10.0, ymax: 10.0 }}
        dosRange={[-2.0, 2.0]}
        colorInfo={undefined}
      />
    </div>
  );

  var jsx2 = (
    <div>
      <h3>Just bands</h3>
      <BandsVisualizer
        bandsDataList={[Si_bands]}
        dosData={null}
        showFermi={true}
        showLegend={undefined}
        yLimit={{ ymin: -10.0, ymax: 10.0 }}
        dosRange={[-2.0, 2.0]}
        colorInfo={undefined}
      />
    </div>
  );

  var jsx3 = (
    <div>
      <h3>Just DOS</h3>
      <BandsVisualizer
        bandsDataList={[]}
        dosData={Si_dos}
        showFermi={true}
        showLegend={undefined}
        yLimit={{ ymin: -10.0, ymax: 10.0 }}
        dosRange={[0.0, 2.5]}
        colorInfo={undefined}
      />
    </div>
  );

  return (
    <div className="App">
      {jsx1}
      {jsx2}
      {jsx3}
    </div>
  );
}

export default App;
