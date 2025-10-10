import { createRouter, createWebHistory } from 'vue-router'

import Login from '../pages/Login.vue'
import Dashboard from '../pages/Dashboard.vue'
import Asignaturas from '../pages/Asignaturas.vue'

// Función simple para saber si el usuario está logueado (cámbiala por tu lógica real)
function isAuthenticated() {
  // Ejemplo: revisa si hay un token en localStorage (ajusta según tu backend)
  return !!localStorage.getItem('token')
}

const routes = [
  { path: '/', component: Login, meta: { public: true } },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/asignaturas', component: Asignaturas, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Global navigation guard para rutas protegidas
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ path: '/' }) // Si no está autenticado, lo manda al Login
  } else if (to.meta.public && isAuthenticated()) {
    next('/dashboard') // Si ya está logueado, no deja volver al Login
  } else {
    next()
  }
})

export default router
