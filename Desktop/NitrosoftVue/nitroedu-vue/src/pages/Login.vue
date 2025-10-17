<template>
  <div class="min-h-screen flex flex-col bg-black/90 nitro-bg-dark overflow-hidden">
    <!-- Navbar -->
    <nav class="w-full flex justify-between items-center px-6 py-3 bg-gradient-to-r from-gray-900 via-[#191f1f] to-gray-900 shadow-md fixed top-0 z-50">
      <div class="flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90" class="w-8 h-8 text-green-400">
          <circle cx="45" cy="45" r="42" fill="#22c55e" />
          <path d="M35 62L55 28M30 38L42 62M48 33L60 62" stroke="#011911" stroke-width="6" stroke-linecap="round"/>
        </svg>
        <span class="font-bold text-xl text-green-300">Nitrosoft</span>
      </div>
      <div class="flex items-center gap-6">
        <ul class="flex gap-8 text-gray-300 cursor-pointer font-semibold text-sm">
          <li class="hover:text-green-400 transition">Inicio</li>
          <li class="hover:text-green-400 transition">Contáctanos</li>
          <li class="hover:text-green-400 transition">Portafolio</li>
          <li class="hover:text-green-400 transition">Servicios</li>
        </ul>
        <button
          @click="toggleDark"
          class="p-1 bg-gray-800 border rounded-full border-green-700 hover:bg-green-900 text-green-400 transition ml-2"
        >
          <span v-if="oscuro" class="bi bi-moon-stars"></span>
          <span v-else class="bi bi-brightness-high"></span>
        </button>
      </div>
    </nav>

    <!-- Contenido principal -->
    <main class="flex-1 flex flex-col md:flex-row items-center justify-center pt-24 px-6 pb-10 gap-10 min-h-[90vh]">
      <!-- Texto bienvenida -->
      <section class="max-w-lg text-green-300 flex flex-col items-center md:items-start px-2 text-center md:text-left">
        <h1 class="text-4xl font-extrabold mb-4 drop-shadow">Bienvenido a Nitrosoft</h1>
        <p class="text-lg mb-3">
          App educativa donde <span class="font-bold text-green-200">despegas</span> y retas tu <span class="font-bold text-green-400">potencial</span>.
        </p>
        <p class="italic text-green-400 text-sm">
          "Con Nitrosoft, cada día puedes superarte."
        </p>
      </section>
      <!-- Panel Login -->
      <section class="bg-[#181d1d] border border-green-700 rounded-3xl shadow-xl py-10 px-8 max-w-md w-full flex flex-col gap-6 overflow-auto">
        <h2 class="text-2xl font-bold text-green-300 text-center tracking-widest mb-5">Iniciar Sesión</h2>
        <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
          <input
            v-model="email"
            type="email"
            placeholder="Correo electrónico"
            required
            class="rounded-lg px-4 py-3 text-green-200 bg-[#161a1a] border border-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 transition text-base"
          />
          <input
            v-model="password"
            type="password"
            placeholder="Contraseña"
            required
            class="rounded-lg px-4 py-3 text-green-200 bg-[#161a1a] border border-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 transition text-base"
          />
          <label class="flex items-center gap-2 mt-1 text-gray-300 text-sm select-none">
            <input type="checkbox" v-model="remember" class="accent-green-500 w-4 h-4" />
            Recordar credenciales
          </label>
          <button type="submit" :disabled="loading" class="bg-gradient-to-r from-green-600 to-green-500 py-3 rounded-lg text-white font-bold hover:from-green-700 hover:to-green-600 transition disabled:opacity-50 flex justify-center items-center gap-2">
            <span v-if="!loading">Iniciar Sesión</span>
            <svg v-else class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          </button>
          <button
            @click="loginGoogle"
            type="button"
            class="border border-green-700 rounded-lg py-3 text-green-300 hover:bg-green-900 transition font-bold flex justify-center items-center gap-2"
          >
            <span class="bi bi-google text-xl"></span>
            Iniciar con Google
          </button>
          <p v-if="error" class="text-red-400 font-semibold mt-2 text-center">{{ error }}</p>
          <p class="text-green-400 text-sm mt-2 hover:underline cursor-pointer text-center">¿Olvidaste la contraseña?</p>
        </form>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider
} from 'firebase/auth'
import { auth } from '../firebase'

const oscuro = ref(true)
const email = ref('')
const password = ref('')
const remember = ref(false)
const loading = ref(false)
const error = ref('')
const router = useRouter()

const provider = new GoogleAuthProvider()

// Corrección: flujo móvil + escritorio
const loginGoogle = async () => {
  error.value = ''
  loading.value = true
  try {
    const isMobile = window.innerWidth < 900 || /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent)
    if (isMobile) {
      await signInWithRedirect(auth, provider)
      // Redirige y recupera login en onMounted
    } else {
      await signInWithPopup(auth, provider)
      router.push('/dashboard')
    }
  } catch {
    error.value = 'Falló el login con Google'
    loading.value = false
  }
}

onMounted(async () => {
  // Redirigir automáticamente tras login Google en móviles
  try {
    const result = await getRedirectResult(auth)
    if (result && result.user) {
      router.push('/dashboard')
    }
  } catch {}
  if (oscuro.value) document.documentElement.classList.add('dark')
})

const toggleDark = () => {
  oscuro.value = !oscuro.value
  if (oscuro.value) document.documentElement.classList.add('dark')
  else document.documentElement.classList.remove('dark')
}

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  try {
    const userCred = await signInWithEmailAndPassword(auth, email.value, password.value)
    localStorage.setItem('token', userCred.user.uid)
    router.push('/dashboard')
  } catch {
    error.value = 'Usuario o contraseña incorrectos'
  }
  loading.value = false
}
</script>

<style scoped>
.nitro-bg-dark {
  background: #0b0f0b;
  min-height: 100vh;
  min-width: 100vw;
  overflow-x: hidden;
}
@media (max-width: 768px) {
  .nitro-bg-dark {
    overflow-y: auto !important;
  }
}
nav {
  background: linear-gradient(90deg, #161f1d 0%, #222826 80%, #191e1e 100%);
  box-shadow: 0 2px 8px #101c13bb;
}
</style>
