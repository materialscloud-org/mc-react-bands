import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js";
import "chartjs-plugin-zoom";

const ChartWithPanning = () => {
  const chartRef = useRef(null);

  var uuidCanvas = Math.random().toString(16).slice(2);

  useEffect(() => {
    const ctx = document.getElementById(uuidCanvas).getContext("2d");
    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["A", "B", "C", "D", "E", "F", "G"],
        datasets: [
          {
            label: "Sample Data",
            data: [10, 20, 30, 40, 50, 60, 70],
            borderColor: "blue",
            backgroundColor: "transparent",
          },
        ],
      },
      options: {
        pan: {
          enabled: true,
          mode: "xy",
        },
        zoom: {
          enabled: false, // Disable zoom if desired
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, []);

  return (
    <div>
      <canvas id={uuidCanvas} />
    </div>
  );
};

export default ChartWithPanning;
