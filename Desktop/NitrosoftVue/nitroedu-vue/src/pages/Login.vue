<template>
  <div class="min-h-screen flex flex-col bg-black/90 relative nitro-bg-dark overflow-hidden">
    <!-- Navbar -->
    <nav class="w-full flex justify-between items-center px-6 py-3 bg-gradient-to-r from-green-800 via-green-900 to-green-800 shadow-md fixed top-0 z-50">
      <div class="flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90" class="w-8 h-8 text-green-400">
          <circle cx="45" cy="45" r="42" fill="#22c55e" />
          <path d="M35 62L55 28M30 38L42 62M48 33L60 62" stroke="#011911" stroke-width="6" stroke-linecap="round"/>
        </svg>
        <span class="font-bold text-xl text-green-300">Nitrosoft</span>
      </div>

           <div class="flex items-center gap-8">
       

        <!-- Sidebar (opciones del navbar a la derecha) -->
        <ul class="flex gap-4 text-green-300 cursor-pointer font-semibold text-sm gap-12">
          <li>Inicio</li>
          <li>Contáctanos</li>
          <li>Portafolio</li>
          <li>Servicios</li>
        </ul>
         <!-- Botón modo oscuro -->
        <button
          @click="toggleDark"
          class="p-1 bg-[#1d2a22] border rounded-full border-green-700 hover:bg-green-800 text-green-300 transition"
        >
          <span v-if="oscuro" class="bi bi-moon-stars"></span>
          <span v-else class="bi bi-brightness-high"></span>
        </button>
      </div>
    </nav>

    <!-- Contenido principal -->
    <main class="flex-1 flex flex-col md:flex-row items-center justify-center pt-20 px-6 pb-10 gap-12 overflow-hidden">
      <!-- Texto bienvenida -->
      <section
        class="max-w-lg text-green-300 flex flex-col items-center md:items-start px-4 text-center md:text-left"
      >
        <h1 class="text-4xl font-extrabold mb-4 drop-shadow">Bienvenido a Nitrosoft</h1>
        <p class="text-lg mb-3">
          Nuestra app educativa donde <span class="font-bold text-green-200">despegas tu aprendizaje</span> y retas tu <span class="font-bold text-green-400">potencial</span>.
        </p>
        <p class="italic text-green-400 text-sm">
          "Con Nitrosoft, cada día puedes superarte."
        </p>
      </section>

      <!-- Panel Login -->
      <section class="bg-black/90 backdrop-blur-xl border border-green-700 rounded-3xl shadow-2xl py-10 px-8 max-w-md w-full flex flex-col gap-6 overflow-auto">
        <h2 class="text-2xl font-bold text-green-300 text-center tracking-widest mb-5">Iniciar Sesión</h2>

        <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
          <input
            v-model="email"
            type="email"
            placeholder="Correo electrónico"
            required
            class="rounded-md px-4 py-3 text-green-200 bg-[#171717de] border border-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 transition"
          />
          <input
            v-model="password"
            type="password"
            placeholder="Contraseña"
            required
            class="rounded-md px-4 py-3 text-green-200 bg-[#171717de] border border-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 transition"
          />

          <label class="flex items-center gap-2 mt-1 text-gray-300 text-sm select-none">
            <input type="checkbox" v-model="remember" class="accent-green-500 w-4 h-4" />
            Recordar credenciales
          </label>

          <button type="submit" :disabled="loading" class="bg-gradient-to-r from-green-600 to-green-400 py-3 rounded-md text-white font-bold hover:from-green-700 hover:to-green-500 transition disabled:opacity-50 flex justify-center items-center gap-2">
            <span v-if="!loading">Iniciar Sesión</span>
            <svg v-else class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          </button>

          <button
            @click="loginGoogle"
            type="button"
            class="border border-green-700 rounded-md py-3 text-green-300 hover:bg-green-900 transition font-bold flex justify-center items-center gap-2"
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '../firebase'

const oscuro = ref(true)
const email = ref('')
const password = ref('')
const remember = ref(false)
const loading = ref(false)
const error = ref('')
const router = useRouter()

const toggleDark = () => {
  oscuro.value = !oscuro.value
  document.documentElement.classList.toggle('dark', oscuro.value)
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

const loginGoogle = async () => {
  error.value = ''
  loading.value = true
  try {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
    router.push('/dashboard')
  } catch {
    error.value = 'Falló el login con Google'
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

/* SCROLL SOLO MÓVILES */
@media (max-width: 768px) {
  .nitro-bg-dark {
    overflow-y: auto !important;
  }
}

/* Aurora animada */
.nitro-aurora-bg {
  background: radial-gradient(ellipse at 70% 20%, #29ffae44 0%, #163a2b12 40%, transparent 70%),
    radial-gradient(ellipse at 0% 100%, #00c48f30 5%, #163a2b16 40%, transparent 70%),
    linear-gradient(140deg, #111810 60%, #0b311b 110%);
  animation: nitro-bg-aura 14s cubic-bezier(.57,.37,.57,.96) infinite alternate;
}

@keyframes nitro-bg-aura {
  0% {
    background-position: 0% 0%, 80% 80%, 0 0;
    filter: brightness(1);
  }
  100% {
    background-position: 50% 80%, 30% 100%, 100% 0;
    filter: brightness(1.1);
  }
}

/* Navbar personalizado */
nav {
  background: linear-gradient(90deg, #116530cc 0%, #2dbf2dcc 50%, #116530cc 100%);
  box-shadow: 0 2px 8px #0d280dbb;
}

/* Links navbar */
nav ul li a {
  transition: color 0.3s ease;
}
nav ul li a:hover {
  color: #88ffb7;
}

/* Botones sociales */
.social-btn-fb,
.social-btn-tw,
.social-btn-wa,
.social-btn-web {
  border: 2px solid #19e59a;
  border-radius: 9999px;
  background: #151c18;
  color: #19e59a;
  padding: 0.5rem;
  transition: all 0.3s;
}

.social-btn-fb:hover {
  background: #1877f2 !important;
  color: white !important;
}

.social-btn-tw:hover {
  background: #1da1f2 !important;
  color: white !important;
}

.social-btn-wa:hover {
  background: #25d366 !important;
  color: white !important;
}

.social-btn-web:hover {
  background: #22c55e !important;
  color: #00390d !important;
}
</style>
