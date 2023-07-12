<template>
  <div class="card-wrapper">
    <h5 class="card-title">
      {{ title }}
    </h5>
    <h1 class="card-content">
      {{ total }}
    </h1>
  </div>
</template>


<script setup>
  const props = defineProps({
    title: String,
    total: String,
  });
</script>

<style>
  .card-wrapper {
    background-color: white;
    border-radius: 4px;
    color: black;
  }
</style>