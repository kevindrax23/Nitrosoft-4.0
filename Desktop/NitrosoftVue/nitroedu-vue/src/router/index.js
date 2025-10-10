import { createRouter, createWebHistory } from 'vue-router'

import Login from '../pages/Login.vue'
import Dashboard from '../pages/Dashboard.vue'
import Asignaturas from '../pages/Asignaturas.vue'
import Evaluaciones from '../pages/Evaluaciones.vue'
import Examen from '../pages/Examen.vue'
// Puedes agregar Estadisticas, Configuración, ChatInterno si tienes sus componentes
import Estadisticas from '../pages/Estadisticas.vue'
import Configuracion from '../pages/Configuracion.vue'
import ChatInterno from '../pages/ChatInterno.vue'
import CrearPreguntas from '../utils/seed.vue'
import Matematicas2 from '../utils/matematicas2.vue'
// Autenticación
function isAuthenticated() { return !!localStorage.getItem('token') }

const routes = [
  { path: '/', component: Login, meta: { public: true } },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/dashboard/asignaturas' },
      { path: 'asignaturas', component: Asignaturas, meta: { requiresAuth: true } },
      { path: 'evaluaciones', component: Evaluaciones, meta: { requiresAuth: true } },
      { path: 'estadisticas', component: Estadisticas, meta: { requiresAuth: true } },
      { path: 'configuracion', component: Configuracion, meta: { requiresAuth: true } },
      { path: 'chatinterno', component: ChatInterno, meta: { requiresAuth: true } },
    ]
  },
  { path: '/examen/:materiaId', component: Examen, meta: { requiresAuth: true } },
  { path: '/crear-preguntas', component: CrearPreguntas },
  { path: '/matematicas2', component: Matematicas2 }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ path: '/' })
  } else if (to.meta.public && isAuthenticated()) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
