
import { createRouter, createWebHistory } from 'vue-router';
import ChartRenderer from './components/ChartRenderer.vue';
import ChartRenderer2 from './components/ChartRenderer2.vue';
import Dashboard from './pages/Dashboard.vue';
import Card from './components/Card.vue';


const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard
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
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
