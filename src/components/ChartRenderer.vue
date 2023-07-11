<template>
  <div>
    <h2>Bar Chart</h2>
    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import cubejsApi from "../plugins/cube";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default {
  setup() {
    const chartCanvas = ref(null);
    let chartInstance = null;

    onMounted(async () => {
      const resultSet = await cubejsApi.load({
        measures: ["Orders.count"],
        dimensions: ["ProductCategories.name"],
      });

      const ctx = chartCanvas.value.getContext("2d");
      chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: resultSet.chartPivot().map((row) => row.x),
          datasets: [
            {
              label: "Orders Count",
              data: resultSet.chartPivot().map((row) => row["Orders.count"]),
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
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
