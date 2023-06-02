import React, { useEffect, useRef } from "react";

import "./bands.css";

import { bandPlot } from "./bands";

import Co_bands from "../data/Co_bands.json";
import Co_bands_fast from "../data/Co_bands_fast.json";
import Si_bands from "../data/Si_bands.json";
import Si_dos from "../data/Si_dos.json";
import Fe_spin_bands_fast from "../data/Fe_spin_bands_fast.json";
import Fe_spin_dos_fast from "../data/Fe_spin_dos_fast.json";

function BandsComponent() {
  var uuidCanvas = Math.random().toString(16).slice(2);
  var uuidTextbox = Math.random().toString(16).slice(2);
  var theBandPlot = null;

  // inputs
  var bandsDataList = [Fe_spin_bands_fast];
  var dosData = Fe_spin_dos_fast;
  var showFermi = true;
  var showLegend = undefined;
  var yLimit = { ymin: -10.0, ymax: 10.0 };
  var dosRange = [-2.0, 2.0];
  var colorInfo = undefined;

  // basic checks
  var isBands = bandsDataList.length > 0;
  var isDos = dosData != undefined || dosData != null;
  var areBoth = isBands && isDos;

  useEffect(() => {
    theBandPlot = bandPlot(
      uuidCanvas,
      uuidTextbox,
      bandsDataList,
      dosData,
      showFermi,
      showLegend,
      yLimit,
      dosRange,
      colorInfo
    );
    return () => {
      if (isBands) theBandPlot.myChart.destroy();
      if (isDos) theBandPlot.myDos.destroy();
    };
  }, []);

  var jsxBandsPlot = null;
  var jsxDosPlot = null;
  var jsxBandsPathInput = null;
  var jsxBandsPathResetButton = null;
  var jsxTogglePdosButton = null;

  if (isBands) {
    jsxBandsPlot = (
      <div
        id={`bandsplot-${uuidCanvas}-div`}
        className={areBoth ? "bands-plot" : "bands-plot-single"}
      >
        <canvas id={uuidCanvas}></canvas>
      </div>
    );
    jsxBandsPathInput = (
      <div className="bands-path-input">
        <span className="span-label"> Edit path: </span>
        <input id={uuidTextbox} className="bands-input" type="text" />
      </div>
    );
    jsxBandsPathResetButton = (
      <button type="button" id={`${uuidCanvas}bt-reset`} className="button">
        Reset default path
      </button>
    );
  }

  if (isDos) {
    jsxDosPlot = (
      <div
        id={`dosplot-${uuidCanvas}-div`}
        className={areBoth ? "dos-plot" : "dos-plot-single"}
      >
        <canvas id={`${uuidCanvas}-dos`}></canvas>
      </div>
    );
    jsxTogglePdosButton = (
      <button
        type="button"
        id={`${uuidCanvas}bt-togglePdos`}
        className="button"
      >
        Toggle PDOS
      </button>
    );
  }

  return (
    <div className="bands-widget-all">
      <div className="plots-container">
        {jsxBandsPlot}
        {jsxDosPlot}
      </div>
      {jsxBandsPathInput}
      <div className="band-widget-buttons">
        {jsxBandsPathResetButton}
        <button
          type="button"
          id={`${uuidCanvas}bt-resetZoom`}
          className="button"
        >
          Reset zoom
        </button>
        <div className="drag-radio-buttons">
          <input
            type="radio"
            id={`${uuidCanvas}bt-dragZoom`}
            name="x"
            defaultChecked
          />
          <label htmlFor={`${uuidCanvas}bt-dragZoom`}>Drag/pinch to zoom</label>
          <input type="radio" id={`${uuidCanvas}bt-dragPan`} name="x" />
          <label htmlFor={`${uuidCanvas}bt-dragPan`}>Drag to pan</label>
        </div>
        {jsxTogglePdosButton}
        <button
          type="button"
          id={`${uuidCanvas}bt-downloadFigure`}
          className="button"
        >
          Download Figure
        </button>
        <button
          type="button"
          id={`${uuidCanvas}bt-downloadJson`}
          className="button"
        >
          Download Json
        </button>
      </div>
    </div>
  );
}

export default BandsComponent;
