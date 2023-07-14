<template>
  <div>
    <h1>Users Vs Orders</h1>
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
        order: {
          "borrower.datecreated": "asc",
        },
        dimensions: ["borrower.firstname"],
        measures: ["borrower.count", "loan.count"],
        filters: [
          {
            member: "company.companyname",
            operator: "equals",
            values: ["Company A"],
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
        type: "bar",

        data: {
          labels: resultSet.chartPivot().map((row) => row.x),
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

    watch(
      () => window.innerWidth,
      (width) => {
        if (chartInstance) {
          const newWidth = width - 200; // Adjust this value based on the sidebar width
          chartInstance.resize(newWidth, chartInstance.height);
        }
      }
    );

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
