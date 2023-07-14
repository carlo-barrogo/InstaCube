<template>
	<div>
		<h1>Loan Amount</h1>
		<div>
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
					"measures": [
					"loan.totalamount"
				],
				"timeDimensions": [
					{
						"dimension": "loan.applicationdate",
						"granularity": "month",
						"dateRange": "Last year"
					}
				],
				"order": {
					"loan.applicationdate": "asc"
				}
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
					labels: resultSet
            .chartPivot()
            .map((row) => moment(row.x).format("MMM Do YYYY")),
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
	}
</style>