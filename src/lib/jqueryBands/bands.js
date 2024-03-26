import {
  BandPlot,
  getPathStringFromPathArray,
  getValidPointNames,
  getPathArrayFromPathString,
} from "./bandstructure";

import tinycolor from "tinycolor2";

// import "chartjs-plugin-zoom";
// import "chartjs-plugin-annotation";
import $ from "jquery";

var plots = {};

//It updates the band graph for user input.
function changeBandPath(textBoxId, plotInfoId) {
  var theTextBox = document.getElementById(textBoxId);
  var string = theTextBox.value;
  var finalPath = getPathArrayFromPathString(string);
  plots[plotInfoId].plotObj.updateBandPlot(finalPath);
}

//It updates the band graph for to its default path.
function resetDefaultBandPath(textBoxId, plotInfoId) {
  var theTextBox = document.getElementById(textBoxId);
  theTextBox.value = getPathStringFromPathArray(
    plots[plotInfoId].plotObj.getDefaultPath()
  );
  plots[plotInfoId].plotObj.updateBandPlot(
    plots[plotInfoId].plotObj.getDefaultPath(),
    true
  );
}

//It updates the band graph for to its default path.
function resetZoom(plotInfoId) {
  // Note: call the resetZoom of he plotObj, not directly the call of the plotObj.myChart
  plots[plotInfoId].plotObj.resetZoom();
}

// Swiches to drag-to-zoom mode
var dragToZoom = function (theBandPlot, dataFilePaths, dosFile) {
  if (dataFilePaths.length) {
    theBandPlot.myChart.options.plugins.zoom.pan.enabled = false;
    theBandPlot.myChart.options.plugins.zoom.zoom.drag.enabled = true;
    theBandPlot.myChart.update("none");
  }

  if (!$.isEmptyObject(dosFile)) {
    theBandPlot.myDos.options.plugins.zoom.pan.enabled = false;
    theBandPlot.myDos.options.plugins.zoom.zoom.drag.enabled = true;
    theBandPlot.myDos.update("none");
  }
};

// Swiches to drag-to-pan mode
function dragToPan(theBandPlot, dataFilePaths, dosFile) {
  if (dataFilePaths.length) {
    theBandPlot.myChart.options.plugins.zoom.pan.enabled = true;
    theBandPlot.myChart.options.plugins.zoom.zoom.drag.enabled = false;
    theBandPlot.myChart.update("none");
  }

  if (!$.isEmptyObject(dosFile)) {
    theBandPlot.myDos.options.plugins.zoom.pan.enabled = true;
    theBandPlot.myDos.options.plugins.zoom.zoom.drag.enabled = false;
    theBandPlot.myDos.update("none");
  }
}

// get json data and create band plot
function bandPlot(
  bandDivId,
  bandPathTextBoxId,
  dataFilePaths,
  dosFile,
  showFermi,
  showLegend,
  yLimit,
  dosRange,
  colorInfo
) {
  plots[bandDivId] = {};

  var b = window.performance.now();
  console.log("start time: plotting band plot: current time => ", bandDivId, b);

  // create band plot object
  var theBandPlot = new BandPlot(
    bandDivId,
    showFermi,
    showLegend,
    yLimit,
    dosRange
  );
  var colorDict;

  // add data for every band structure
  if (dataFilePaths.length) {
    dataFilePaths.forEach(function (dataFilePath, dataIdx) {
      var colorDict;

      if (colorInfo !== undefined) {
        if (typeof colorInfo[dataIdx] === "object") {
          var newColor = tinycolor("red");
          colorDict = [newColor, colorInfo[dataIdx][0], colorInfo[dataIdx][1]];
        } else if (typeof colorInfo[dataIdx] === "string") {
          var newColor = tinycolor(colorInfo[dataIdx]);
          colorDict = [
            newColor.toHexString(),
            newColor.darken(20).toHexString(),
            newColor.brighten(20).toHexString(),
          ];
        } else {
          // default bandstructure color is red
          var newColor = tinycolor("red");
          colorDict = [
            newColor.toHexString(),
            newColor.darken(20).toHexString(),
            newColor.brighten(20).toHexString(),
          ];
        }
      }

      theBandPlot.addBandStructure(dataFilePath, colorDict);
    });

    // update band structure data for plotting
    theBandPlot.updateBandPlot();

    var theTextBox = document.getElementById(bandPathTextBoxId);
    theTextBox.value = getPathStringFromPathArray(theBandPlot.getDefaultPath());

    theTextBox.onkeyup = function () {
      var theTextBox = document.getElementById(bandPathTextBoxId);
      var string = theTextBox.value;
      var finalPath = getPathArrayFromPathString(string);
      theBandPlot.updateBandPlot(finalPath);
    };

    var helperString =
      "Use - to define a segment<br>Use | to split the path.<br>Valid point names:<br>";
    var validPoints = getValidPointNames(theBandPlot.allData);
    helperString += validPoints.join(", ");

    var theResetButton = document.getElementById(bandDivId + "bt-reset");
    theResetButton.onclick = function () {
      var theTextBox = document.getElementById(bandPathTextBoxId);
      theTextBox.value = getPathStringFromPathArray(
        theBandPlot.getDefaultPath()
      );
      theBandPlot.updateBandPlot(theBandPlot.getDefaultPath(), true);
    };

    var theDownloadFigureButton = document.getElementById(
      bandDivId + "bt-downloadFigure"
    );
    theDownloadFigureButton.onclick = function () {
      if ($.isEmptyObject(dosFile)) {
        var a = document.createElement("a");

        a.href = theBandPlot.myChart.toBase64Image("bandstructure.png", 1);
        a.download = "bandstructure.png";
        a.click();
      }
    };

    var theDownloadJsonButton = document.getElementById(
      bandDivId + "bt-downloadJson"
    );
    theDownloadJsonButton.onclick = function () {
      if ($.isEmptyObject(dosFile)) {
        var a = document.createElement("a");
        if (dataFilePaths.length) {
          dataFilePaths.forEach(function (dataFilePath, dataIdx) {
            a.href =
              "data:text/json;charset=utf-8," +
              encodeURIComponent(JSON.stringify(dataFilePath));
            a.download = "bandData" + dataIdx + ".json";
            a.click();
          });
        }
      }
    };
  }

  if (!$.isEmptyObject(dosFile)) {
    theBandPlot.addDos(dosFile);

    if (dataFilePaths.length) {
      theBandPlot.updateDosPlot("vertical");
    } else {
      theBandPlot.updateDosPlot("horizontal");
    }

    function setPdosVisibility(hidden) {
      theBandPlot.dosSeries.forEach((series, i) => {
        if (series.label.toLowerCase().includes("total")) {
          return;
        }
        if (series.label.toLowerCase().includes("y axis")) {
          return;
        }
        // assume that everything else is PDOS and hide them
        if (hidden) {
          theBandPlot.myDos.hide(i);
        } else {
          theBandPlot.myDos.show(i);
        }
      });
    }

    var theTogglePdosButton = document.getElementById(
      bandDivId + "bt-togglePdos"
    );
    theTogglePdosButton.onclick = function () {
      if (theTogglePdosButton.classList.contains("button")) {
        $("#" + bandDivId + "bt-togglePdos").addClass("button-white");
        $("#" + bandDivId + "bt-togglePdos").removeClass("button");
        setPdosVisibility(true);
      } else {
        $("#" + bandDivId + "bt-togglePdos").addClass("button");
        $("#" + bandDivId + "bt-togglePdos").removeClass("button-white");
        setPdosVisibility(false);
      }
      theBandPlot.myDos.update();
    };

    var theDownloadFigureButton = document.getElementById(
      bandDivId + "bt-downloadFigure"
    );
    theDownloadFigureButton.onclick = function () {
      var a = document.createElement("a");
      if (dataFilePaths.length) {
        var b = document.createElement("a");

        a.href = theBandPlot.myDos.toBase64Image("dos.png", 1);
        b.href = theBandPlot.myChart.toBase64Image("bandstructure.png", 1);

        a.download = "dos.png";
        b.download = "bandstructure.png";

        b.click();
      } else {
        a.href = theBandPlot.myDos.toBase64Image("dos.png", 1);
        a.download = "dos.png";
      }
      a.click();
    };

    var theDownloadJsonButton = document.getElementById(
      bandDivId + "bt-downloadJson"
    );
    theDownloadJsonButton.onclick = function () {
      var a = document.createElement("a");

      if (dataFilePaths.length) {
        dataFilePaths.forEach(function (dataFilePath, dataIdx) {
          a.href =
            "data:text/json;charset=utf-8," +
            encodeURIComponent(JSON.stringify(dataFilePath));
          a.download = "bandData" + dataIdx + ".json";
          a.click();
        });
        a.href =
          "data:text/json;charset=utf-8," +
          encodeURIComponent(JSON.stringify(dosFile));
        a.download = "dosData.json";
        a.click();
      } else {
        a.href =
          "data:text/json;charset=utf-8," +
          encodeURIComponent(JSON.stringify(dosFile));
        a.download = "dosData.json";
        a.click();
      }
    };
  }

  // theBandPlot.myChart.options.pan.enabled = true ;
  // theBandPlot.myChart.options.pan.mode = "y";

  // theBandPlot.myChart.options.zoom.enabled = true;
  // theBandPlot.myChart.options.zoom.mode = "y";
  // theBandPlot.myChart.options.zoom.drag = true;

  // theBandPlot.myChart.update();

  plots[bandDivId].plotObj = theBandPlot;

  var theResetZoomButton = document.getElementById(bandDivId + "bt-resetZoom");
  theResetZoomButton.onclick = function () {
    if (dataFilePaths.length) theBandPlot.resBandZoom();
    if (!$.isEmptyObject(dosFile) && dataFilePaths.length)
      theBandPlot.resDosZoom("vertical");
    if (!$.isEmptyObject(dosFile) && !dataFilePaths.length)
      theBandPlot.resDosZoom("horizontal");
  };

  var theDragPanButton = document.getElementById(bandDivId + "bt-dragPan");
  theDragPanButton.onclick = function () {
    dragToPan(theBandPlot, dataFilePaths, dosFile, bandDivId);
  };

  var theDragZoomButton = document.getElementById(bandDivId + "bt-dragZoom");
  theDragZoomButton.onclick = function () {
    dragToZoom(theBandPlot, dataFilePaths, dosFile, bandDivId);
  };

  // enable zoom
  //dragToZoom(theBandPlot, dataFilePaths, dosFile, bandDivId);

  // $(theTextBox).data('bs.tooltip', false).tooltip({title: helperString, html: true})
  //                        .tooltip('show'); // Open the tooltip

  console.log(
    "end time: plotting band plot: current time, total time => ",
    bandDivId,
    window.performance.now(),
    window.performance.now() - b
  );

  return theBandPlot;
}

export { bandPlot };

// module.exports = {
//   bandPlot: bandPlot,
//   printTest: printTest,
// };
