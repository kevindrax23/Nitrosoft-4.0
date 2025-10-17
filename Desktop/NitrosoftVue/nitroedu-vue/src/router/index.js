import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

// Páginas
import Login from '../pages/Login.vue'
import Dashboard from '../pages/Dashboard.vue'
import Asignaturas from '../pages/Asignaturas.vue'
import Evaluaciones from '../pages/Evaluaciones.vue'
import Examen from '../pages/Examen.vue'
import Estadisticas from '../pages/Estadisticas.vue'
import Configuracion from '../pages/Configuracion.vue'
import ChatInterno from '../pages/ChatInterno.vue'
import CrearPreguntas from '../utils/seed.vue'
import Matematicas2 from '../utils/matematicas2.vue'
import Lecciones from '../pages/Lecciones.vue'
import CrearLeccion from '../utils/crearLeccion.vue'

// Helper para autenticación
function isAuthenticated() {
  const auth = getAuth()
  return auth.currentUser !== null
}

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login, meta: { public: true } },

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
  { path: '/crear-preguntas', component: CrearPreguntas, meta: { requiresAuth: true } },
  { path: '/matematicas2', component: Matematicas2, meta: { requiresAuth: true } },
  { path: '/lecciones/:id', name: 'Lecciones', component: Lecciones, meta: { requiresAuth: true } },
  { path: '/crear-leccion', name: 'CrearLeccion', component: CrearLeccion, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Protección inteligente de rutas
let authChecked = false

router.beforeEach((to, from, next) => {
  const auth = getAuth()

  if (!authChecked) {
    onAuthStateChanged(auth, (user) => {
      authChecked = true
      handleAuthRedirect(to, next, user)
    })
  } else {
    handleAuthRedirect(to, next, auth.currentUser)
  }
})

// Manejo de redirecciones según estado
function handleAuthRedirect(to, next, user) {
  const requiresAuth = to.meta.requiresAuth
  const isPublic = to.meta.public

  if (requiresAuth && !user) {
    next('/login')
  } else if (isPublic && user) {
    next('/dashboard')
  } else {
    next()
  }
}

export default router
