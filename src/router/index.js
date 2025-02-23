import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import ImageManager from '../views/ImageManager.vue';

const routes = [
  {
    path: '/',
    name: 'ImageManager',
    component: ImageManager,
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/AboutView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
