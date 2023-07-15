<template>
  <div>
    <h1>Payment Breakdown</h1>
    <select v-model="selected">
      <option disabled value="">Please select one</option>
      <option value="Company A">A</option>
      <option value="Company B">B</option>
      <option value="Company C">C</option>
    </select>
    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>
    <div class="table">
      <table>
        <thead>
          <tr>
            <th>Loan Payment Status</th>
            <th>Borrower First Name</th>
            <th>Borrower Last Name</th>
            <th>Period</th>
            <th>Loan Amount</th>
            <th>Convenience Fee</th>
            <th>Total Amount</th>
            <!-- <th>Application Date</th> -->
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in tableData"
            :key="row['loan_payment.loanpaymentstatus']"
          >
            <td>{{ row["loan_payment.loanpaymentstatus"] }}</td>
            <td>{{ row["borrower.firstname"] }}</td>
            <td>{{ row["borrower.lastname"] }}</td>
            <td>{{ row["loan_payment.period"] }}</td>
            <td>{{ row["loan.loanamount"] }}</td>
            <td>{{ row["loan.conveniencefee"] }}</td>
            <td>{{ row["loan.totalamount"] }}</td>
            <!-- <td>{{ row['loan.applicationdate'] }}</td> -->
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import { ref, onMounted, watch, watchEffect, reactive } from "vue";
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
    const tableData = reactive([]);

    watchEffect(() => {
      // Only update the chart if a valid option is selected
      if (selected.value !== "") {
        updateChart(selected.value);
        updateTableData(selected.value);
      }
    });

    onMounted(async () => {
      // Load initial chart data with the default filter value
      await updateChart(selected.value);
      await updateTableData(selected.value);
    });

    async function updateChart(selectedValue) {
      const resultSet = await cubejsApi.load({
        order: {
          "loan.count": "desc",
        },
        filters: [
          {
            member: "company.companyname",
            operator: "equals",
            values: [selectedValue],
          },
        ],
        measures: ["loan.count"],
        timeDimensions: [
          {
            dimension: "loan_payment.datecreated",
            granularity: "week",
            dateRange: "This month",
          },
        ],
        dimensions: ["loan.loanstatus"],
      });

      const status =resultSet.loadResponses[0].data.filter(
        (obj, index, f) =>
          f.findIndex(
            (item) => item[`loan.loanstatus`] === obj[`loan.loanstatus`]
          ) === index
      )
    
      if (chartInstance) {
        // Update the chart data and labels
        chartInstance.data.labels = resultSet
          .chartPivot()
          .map((row) => moment(row.x).format("MMMM-DD-YYYY"));
        chartInstance.data.datasets = status.map((measure) => ({
            label: getLegendName(measure[`loan.loanstatus`]),
            data: resultSet
          .chartPivot().map((row)=> row[`${measure[`loan.loanstatus`]},loan.count`]),
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
    async function updateTableData(selectedValue) {
      const resultSet = await cubejsApi.load({
        order: {
          "loan.loanamount": "desc",
        },
        dimensions: [
          "loan_payment.loanpaymentstatus",
          "borrower.firstname",
          "borrower.lastname",
          "loan_payment.period",
        ],
        filters: [
          {
            member: "company.companyname",
            operator: "equals",
            values: [selectedValue],
          },
        ],
        measures: [
          "loan.loanamount",
          "loan.conveniencefee",
          "loan.totalamount",
        ],
      });

      tableData.splice(0, tableData.length, ...resultSet.tablePivot());
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
      tableData,
    };
  },
};
</script>

<style>
.chart-container {
  height: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.table {
  display: flex;
  position: relative;
  border-radius: 4px;
  padding: 24px;
  margin-top: 40px;
  justify-content: space-around;
  align-items: center;
}
.table {
  display: flex;
  position: relative;
  border-radius: 4px;
  padding: 24px;
  margin-top: 40px;
  justify-content: space-around;
  align-items: center;
}
table {
  border: 1px solid #ddd;
  border-collapse: collapse;
  width: 100%;
}
thead {
  background-color: #f5f5f5;
  color: #333;
}
th,
td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}
tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}
tbody tr:hover {
  background-color: #eaf6ff;
}
</style>
