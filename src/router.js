
import { createRouter, createWebHistory } from 'vue-router';
import ChartRenderer from './components/ChartRenderer.vue';
import ChartRenderer2 from './components/ChartRenderer2.vue';


const routes = [
  {
    path: '/',
    name: 'ChartRenderer',
    component: ChartRenderer
  },
  {
    path: '/chartRenderer',
    name: 'chartRenderer',
    component: ChartRenderer
  },
  {
    path: '/chartRenderer2',
    name: 'chartRenderer2',
    component: ChartRenderer2
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
