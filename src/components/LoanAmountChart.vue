<template>
  <div>
    <h1>Loan Amount</h1>
    <div>
      <select v-model="selected">
        <option disabled value="">Please select one</option>
        <option value="Company A">A</option>
        <option value="Company B">B</option>
        <option value="Company C">C</option>
      </select>
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch,watchEffect } from "vue";
import cubejsApi from "../plugins/cube";
import { Chart, registerables } from "chart.js";
import moment from "moment";
import { getLegendName, getRandomColor } from "../utils/chartUtils";
Chart.register(...registerables);

export default {
  setup() {
    const chartCanvas = ref(null);
    let chartInstance = null;
    const selected = ref("Company A");

    watchEffect(() => {
      // Only update the chart if a valid option is selected
      if (selected.value !== "") {
        updateChart(selected.value);
      }
    });

    onMounted(async () => {
      // Load initial chart data with the default filter value
      await updateChart(selected.value);
    });

    async function updateChart(selectedValue) {
      const resultSet = await cubejsApi.load({
        measures: ["loan.totalamount"],
        timeDimensions: [
          {
            dimension: "loan.applicationdate",
            granularity: "month",
            dateRange: "Last year",
          },
        ],
        order: {
          "loan.applicationdate": "asc",
        },
		filters: [
          {
            member: "company.companyname",
            operator: "equals",
            values: [selectedValue],
          },
		]
      });

      if (chartInstance) {
        // Update the chart data and labels
        chartInstance.data.labels = resultSet.chartPivot().map((row) =>moment(row.x).format('MMMM-DD-YYYY'));
        chartInstance.data.datasets = resultSet
          .pivotQuery()
          .measures.map((measure) => ({
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
      selected,
    };
  },
};
// export default {
// 	setup() {
// 		const chartCanvas = ref(null);
// 		let chartInstance = null;

// 		onMounted(async () => {
// 			const resultSet = await cubejsApi.load({
// 					"measures": [
// 					"loan.totalamount"
// 				],
// 				"timeDimensions": [
// 					{
// 						"dimension": "loan.applicationdate",
// 						"granularity": "month",
// 						"dateRange": "Last year"
// 					}
// 				],
// 				"order": {
// 					"loan.applicationdate": "asc"
// 				}
// 			});

// 			const measures = resultSet.pivotQuery().measures;
// 			const datasets = measures.map((measure) => ({
// 				label: getLegendName(measure),
//         data: resultSet.chartPivot().map((row) => row[measure]),
//         backgroundColor: getRandomColor(),
// 			}));
// 			const ctx = chartCanvas.value.getContext("2d");
// 			chartInstance = new Chart(ctx, {
// 				type: "line",
// 				data: {
// 					labels: resultSet
//             .chartPivot()
//             .map((row) => moment(row.x).format("MMM Do YYYY")),
//           datasets: datasets,
// 				},
// 				options: {
//           scales: {
//             y: {
//               beginAtZero: true,
//             },
//           },
//         },
// 			});
// 		});

// 		watch(
//       () => window.innerWidth,
//       (width) => {
//         if (chartInstance) {
//           const newWidth = width - 200; // Adjust this value based on the sidebar width
//           chartInstance.resize(newWidth, chartInstance.height);
//         }
//       }
//     );

//     return {
//       chartCanvas,
//     };
// 	},
// };
</script>

<style>
.chart-container {
  height: 400px;
  width: 100%;
}
</style>
