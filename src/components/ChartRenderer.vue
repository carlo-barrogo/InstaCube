<template>
  <div>
    <h2>Example Chart</h2>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import cubejsApi from "../plugins/cube";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default {
  setup() {
    const chartCanvas = ref(null);

    onMounted(async () => {
      try {
        const resultSet = await cubejsApi.load({
          measures: ["Orders.count"],
          dimensions: ["ProductCategories.name"],
          
        });

        const ctx = chartCanvas.value.getContext("2d");
        new Chart(ctx, {
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
      } catch (error) {
        console.error(error);
      }
    });

    return {
      chartCanvas,
    };
  },
};
</script>
