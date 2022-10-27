import Home from './pages/Home.vue'
import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Home
    }
  ]
})