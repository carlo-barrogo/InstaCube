<template>
  <div>
    <h1>Users Vs Orders</h1>
    <select v-model="selected">
    <option disabled value="">Please select one</option>
    <option value="Company A">A</option>
    <option value="Company B">B</option>
    <option value="Company C">C</option>
  </select>
    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>
<script>
import { ref, onMounted, watch, watchEffect } from "vue";
import cubejsApi from "../plugins/cube";
import { Chart, registerables } from "chart.js";
import moment from "moment";
import { getLegendName, getRandomColor } from "../utils/chartUtils";

Chart.register(...registerables);

export default {
  setup() {
    const chartCanvas = ref(null);
    let chartInstance = null;
    const selected = ref('Company A');

    watchEffect(() => {
      // Only update the chart if a valid option is selected
      if (selected.value !== '') {
        updateChart(selected.value);
      }
    });

    onMounted(async () => {
      // Load initial chart data with the default filter value
      await updateChart(selected.value);
    });

    async function updateChart(selectedValue) {
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
            values: [selectedValue],
          },
        ],
      });

      if (chartInstance) {
        // Update the chart data and labels
        chartInstance.data.labels = resultSet.chartPivot().map((row) => row.x);
        chartInstance.data.datasets = resultSet.pivotQuery().measures.map((measure) => ({
          label: getLegendName(measure),
          data: resultSet.chartPivot().map((row) => row[measure]),
          backgroundColor: getRandomColor(),
        }));

        chartInstance.update(); // Update the chart with new data
      } else {
        // Create the chart instance for the first time
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
      }
    }

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
      selected
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
