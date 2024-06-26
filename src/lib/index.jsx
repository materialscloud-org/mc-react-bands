import React, { useEffect, useRef } from "react";

import "./bands.css";

import { bandPlot } from "./jqueryBands/bands";

function BandsVisualizer(props) {
  var uuidCanvas = Math.random().toString(16).slice(2);
  var uuidTextbox = Math.random().toString(16).slice(2);
  var theBandPlot = useRef(null);

  // basic checks
  var isBands = !(!props.bandsDataList || props.bandsDataList.length == 0);
  var isDos = !(!props.dosData || Object.keys(props.dosData).length === 0);
  var areBoth = isBands && isDos;

  useEffect(() => {
    theBandPlot = bandPlot(
      uuidCanvas,
      uuidTextbox,
      isBands ? props.bandsDataList : [],
      props.dosData,
      props.energyRange,
      props.dosRange,
      props.bandsColorInfo,
      props.formatSettings
    );
    return () => {
      if (isBands) theBandPlot.myChart.destroy();
      if (isDos) theBandPlot.myDos.destroy();
    };
  }, [props]);

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
        Reset path
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
        <div className="drag-button-container">
          <div className="drag-radio-buttons">
            <input
              type="radio"
              id={`${uuidCanvas}bt-dragZoom`}
              name={`${uuidCanvas}-radio`}
              defaultChecked
            />
            <label htmlFor={`${uuidCanvas}bt-dragZoom`}>Drag to zoom</label>
            <input
              type="radio"
              id={`${uuidCanvas}bt-dragPan`}
              name={`${uuidCanvas}-radio`}
            />
            <label htmlFor={`${uuidCanvas}bt-dragPan`}>Drag to pan</label>
          </div>
        </div>
        {jsxTogglePdosButton}
        <button
          type="button"
          id={`${uuidCanvas}bt-downloadFigure`}
          className="button"
        >
          Download image
        </button>
        <button
          type="button"
          id={`${uuidCanvas}bt-downloadJson`}
          className="button"
        >
          Download json
        </button>
      </div>
    </div>
  );
}

export default BandsVisualizer;
