import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import SplitView from '@/pages/SplitView.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/split-view', component: SplitView },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
