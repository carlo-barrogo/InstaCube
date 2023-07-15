<template>
  <div id="app">
    <div :class="['container', { collapsed: isSidebarCollapsed }]">
      <div class="sidebar">
        <button class="toggle-button" @click="toggleSidebar">
          <span class="toggle-icon">
            <img v-if="isSidebarCollapsed" class="imageCollapse" src="./assets/logo.png"/>
      
          </span>
          <span v-if="!isSidebarCollapsed" class="toggle-label"> <img class="imgLogo" src="./assets/logo.png"/> InstaCube</span>
        </button>
        <div class="sidebar-content">
          <router-link to="/dashboard" class="sidebar-link">
            <span class="link-icon"><i class="bi bi-grid-fill"></i></span>
            <span v-if="!isSidebarCollapsed">Dashboard</span>
          </router-link>
          <router-link to="/chartRenderer" class="sidebar-link">
            <span class="link-icon"><i class="bi bi-bar-chart-fill"></i></span>
            <span v-if="!isSidebarCollapsed">ChartRenderer</span>
          </router-link>
          <router-link to="/chartRenderer2" class="sidebar-link">
            <span class="link-icon"><i class="bi bi-cash-coin"></i></span>
            <span v-if="!isSidebarCollapsed">Payments</span>
          </router-link>
          <router-link to="/chartRenderer3" class="sidebar-link">
            <span class="link-icon"><i class="bi bi-wallet-fill"></i></span>
            <span v-if="!isSidebarCollapsed">Loans</span>
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
@import './assets/fonts/Rubik/Rubik.css';
.container {
  display: flex;
  min-height: 80vh;
  
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
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    padding: 7px;
    margin-left: 10px;
    background-color: #333333;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #ffffff;
    flex-direction: row-reverse;
}

.toggle-icon {
  width: 20px;
  margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;


}
.imgLogo{
  
    height: 30px;
    width: 25px;
  
}
.imageCollapse{
  height: 35px;
  width: 30px;
}

.toggle-label {
  flex-grow: 1;
  font-size: 18px;
  font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: space-between; 
}

.sidebar-content {
  margin-top: 20px;
}

.sidebar-link {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px;
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
.sidebar-link span:nth-child(2){
  margin-left: 10px;
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
  height: auto;
  background-color: #f4f4f4;
  color: #17ad49;
  transition: margin-left 0.3s;
}


#app {
  font-family: 'Rubik', Helvetica, Arial, sans-serif;
  max-width: 3080px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}
</style>

