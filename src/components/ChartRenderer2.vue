<template>
    <div>
      <h2>Users Vs Orders</h2>
      <div class="chart-container">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, watch } from "vue";
  import cubejsApi from "../plugins/cube";
  import { Chart, registerables } from "chart.js";
  import moment from "moment";
  import { getLegendName, getRandomColor } from "../utils/chartUtils";

  Chart.register(...registerables);
  
  export default {
    setup() {
      const chartCanvas = ref(null);
      let chartInstance = null;
  
      onMounted(async () => {
        const resultSet = await cubejsApi.load({
          measures: ["Users.count","Orders.count"],
          timeDimensions: [
          {
            dimension: "LineItems.createdAt",
            granularity: "month",
          },
        ],
        
        });
        const measures = resultSet.pivotQuery().measures;
        const datasets = measures.map((measure) => ({
          label: getLegendName(measure),
          data: resultSet.chartPivot().map((row) => row[measure]),
          backgroundColor: getRandomColor(),
        }));
        const ctx = chartCanvas.value.getContext("2d");
        chartInstance = new Chart(ctx, {
          type: "line",
          data: {
            labels: resultSet.chartPivot().map((row) =>
              moment(row.x).format("MMM D YYYY")
            ),
            datasets: datasets,
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      });
    //   function getRandomColor() {
    //     const letters = "0123456789ABCDEF";
    //     let color = "#";
    //     for (let i = 0; i < 6; i++) {
    //       color += letters[Math.floor(Math.random() * 16)];
    //     }
    //     return color;
    //   }
    //   function getLegendName(measure) {
    //   // Customize the legend name for each measure
    //   if (measure === "Users.count") {
    //     return "Users";
    //   } else if (measure === "Orders.count") {
    //     return "Orders";
    //   } else {
    //     return measure; // Fallback to the original measure name
    //   }
    // }

      watch(() => window.innerWidth, (width) => {
        if (chartInstance) {
          const newWidth = width - 200; // Adjust this value based on the sidebar width
          chartInstance.resize(newWidth, chartInstance.height);
        }
      });
  
      return {
        chartCanvas,
      };
    },
  };
  </script>
  
  <style>
  .chart-container {
    height: 400px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  </style>
  