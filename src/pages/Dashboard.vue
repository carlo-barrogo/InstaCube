<template>
	<h1>Dashboard</h1>
	<div class="dashboard-container">
		<div class="filter">
			<span>Filter by Company: </span>
			<select v-model="selected">
				<option disabled value="">Please select one</option>
				<option value="Company A">A</option>
				<option value="Company B">B</option>
				<option value="Company C">C</option>
			</select>
		</div>
		
		<div class="cards-container">
			<Card :total="totalLoans" title="Total Loan Amount"/>
			<Card :total="totalConvenienceFee" title="Total Convenience Fee"/>
			<Card :total="grandTotal" title="Grand Total"/>
		</div>

		<div class="loan-amount">
			<h1>Loan Amount</h1>
			<div class="loan-amount-chart">
				<canvas ref="chartCanvas"></canvas>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, onMounted, watch, watchEffect } from "vue";
	import cubejsApi from "../plugins/cube";
	import { Chart, registerables } from "chart.js";
	import moment from "moment";
	import { getLegendName, getRandomColor } from "../utils/chartUtils";
	Chart.register(...registerables);
  import Card from "../components/Card.vue";
	
	const totalLoans = ref(null);
	const totalConvenienceFee = ref(null);
	const grandTotal = ref(null);
	const chartCanvas = ref(null);
	let chartInstance = null;
	const selected = ref("Company A");

	watchEffect(() => {
		// Only update the chart if a valid option is selected
		if (selected.value !== "") {
			updateTotalAmount(selected.value);
			updateConvenienceFee(selected.value);
			updateGrandTotal(selected.value);
			updateChart(selected.value);
		}
	});

	onMounted(async () => {
		// Load initial chart data with the default filter value
		await updateTotalAmount(selected.value);
		await updateConvenienceFee(selected.value);
		await updateGrandTotal(selected.value);
		await updateChart(selected.value);
	});

	async function updateTotalAmount(selectedValue) {
		const totalLoansQuery = await cubejsApi.load({
			measures: ["loan.totalamount"],
			timeDimensions: [
				{ dimension: "loan.applicationdate" }
			],
			order: {},
			filters: [
				{
					member: "company.companyname",
					operator: "equals",
					values: [selectedValue],
				}
			]
		});

		totalLoans.value = totalLoansQuery
			.rawData()
			.map((item) => Object.values(item).map((value) => value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")))
			.join(" ")
	}

	async function updateConvenienceFee(selectedValue) {
		const totalConvenienceFeeQuery = await cubejsApi.load({
			measures: ["loan.conveniencefee"],
			timeDimensions: [
				{ dimension: "loan.applicationdate" }
			],
			order: {},
			filters: [
				{
					member: "company.companyname",
					operator: "equals",
					values: [selectedValue],
				}
			]
		});

		totalConvenienceFee.value = totalConvenienceFeeQuery
			.rawData()
			.map((item) => Object.values(item).map((value) => value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")))
			.join(" ")
	}

	async function updateGrandTotal(selectedValue) {
		const grandTotalQuery = await cubejsApi.load({
			measures: ["loan.totalamount"],
			timeDimensions: [
				{ dimension: "loan.applicationdate" }
			],
			order: {},
			filters: [
				{
					member: "company.companyname",
					operator: "equals",
					values: [selectedValue],
				}
			]
		});

		grandTotal.value = grandTotalQuery 
			.rawData()
			.map((item) => Object.values(item).map((value) => value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")))
			.join(" ")
	}	

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

</script>

<style>
	.cards-container {
		display: grid;
		grid-template-columns: 2fr repeat(2, 1fr);
  	column-gap: 1rem;
	}

	.filter {
		margin-bottom: 16px;
		display: flex;
		align-items: center;
		justify-content: left;
	}
	
	select {
		height: 32px;
		border-radius: 4px;
		border: 1px solid #cccccc;
		padding: 8px;
		color: #b3b3b3;
	}

	.loan-amount {
		background-color: white;
		border-radius: 4px;
		padding: 16px;
		margin-top: 40px;
	}

	.loan-amount-chart {
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
