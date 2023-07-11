<template>
  <div id="app">
    <div :class="['container', { collapsed: isSidebarCollapsed }]">
      <div class="sidebar">
        <button class="toggle-button" @click="toggleSidebar">
          <span class="toggle-icon">
            <i class="bi" :class="[isSidebarCollapsed ? 'bi-list' : '']"></i>
          </span>
          <span v-if="!isSidebarCollapsed" class="toggle-label">InstaCube</span>
        </button>
        <div class="sidebar-content">
          <router-link to="/chartRenderer" class="sidebar-link">
            <span class="link-icon"><i class="bi bi-bar-chart-fill"></i></span>
            <span v-if="!isSidebarCollapsed">ChartRenderer</span>
          </router-link>
          <router-link to="/chartRenderer2" class="sidebar-link">
            <span class="link-icon"><i class="bi bi-bezier2"></i></span>
            <span v-if="!isSidebarCollapsed">ChartRenderer2</span>
          </router-link>
          <!-- Add more links as needed -->
        </div>
      </div>
      <div class="main-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const isSidebarCollapsed = ref(false);

    function toggleSidebar() {
      isSidebarCollapsed.value = !isSidebarCollapsed.value;
    }

    return {
      isSidebarCollapsed,
      toggleSidebar,
    };
  },
};
</script>
<style>
.container {
  display: flex;
}

.sidebar {
  width: 200px;
  background-color: #333333;
  transition: width 0.3s;
  padding: 20px;
  box-sizing: border-box;
}

.collapsed .sidebar {
  width: 80px;
}

.toggle-button {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px;
  background-color: #333333;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #ffffff;
}

.toggle-icon {
  width: 20px;
  margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.toggle-label {
  flex-grow: 1;
  display: flex;
  align-items: center;
}

.sidebar-content {
  margin-top: 20px;
}

.sidebar-link {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px;
  color: #ffffff;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: none;
}

.link-icon {
  width: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.main-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #242424;
  color: #ffffff;
  transition: margin-left 0.3s;
}


#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}
</style>

