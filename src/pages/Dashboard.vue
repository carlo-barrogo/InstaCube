<template>
	<h1>Dashboard</h1>
	<div class="dashboard-container">
		<Card :total="totalOrders" title="Total Orders"/>
		<Card :total="totalUsers" title="Total Users"/>
	</div>
</template>

<script setup>
	import { ref, onMounted } from "vue";
	import cubejsApi from "../plugins/cube";
  import Card from "../components/Card.vue";
	
	const totalOrders = ref(null);
	const totalUsers = ref(null);

	onMounted(async () => {
		const totalOrdersQuery = await cubejsApi.load({
			measures: ["Orders.count"],
		});

		totalOrders.value = totalOrdersQuery
			.rawData()
			.map((item) => Object.values(item).map((value) => value))
			.join(" ")

		const totalUsersQuery = await cubejsApi.load({
			measures: ["Users.count"],
		});

		totalUsers.value = totalUsersQuery
			.rawData()
			.map((item) => Object.values(item).map((value) => value))
			.join(" ")
	});
</script>

<style>
	.dashboard-container {
		display: grid;
		grid-template-columns: 2fr repeat(2, 1fr);
  	column-gap: 1rem;
	}
</style>