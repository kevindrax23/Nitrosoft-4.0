<template>
  <div class="min-h-screen h-screen w-full flex items-center justify-center nitro-bg-dark overflow-hidden font-sans relative">
    <!-- Aurora Animada -->
    <div class="absolute inset-0 z-0 pointer-events-none nitro-aurora-bg"></div>

    <!-- Modo oscuro toggle, FIJO -->
    <div class="fixed top-4 right-6 z-40 flex items-center">
      <button @click="toggleDark" class="p-0.5 bg-[#1d2a22] border rounded-full border-green-700 flex items-center justify-center hover:bg-green-900 transition">
        <span v-if="oscuro" class="text-green-300 bi bi-moon-stars text-lg"></span>
        <span v-else class="text-yellow-300 bi bi-brightness-high text-lg"></span>
      </button>
    </div>

    <div class="relative z-10 w-full max-w-7xl flex flex-col md:flex-row items-center justify-between px-2 md:px-8"
         style="height:calc(100vh - 56px);">
      <!-- Branding izquierda -->
      <section class="w-full md:w-1/2 flex flex-col items-center md:items-start justify-center px-3 py-10 md:mr-6 h-full">
        <div class="mb-3 w-28 h-28 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90" fill="none"><circle cx="45" cy="45" r="42" fill="#22c55e" /><path d="M35 62L55 28M30 38L42 62M48 33L60 62" stroke="#011911" stroke-width="7" stroke-linecap="round"/></svg>
        </div>
        <h1 class="text-4xl md:text-5xl font-extrabold text-green-400 mb-2 drop-shadow text-left">Bienvenido a Nitrosoft</h1>
        <div class="text-lg md:text-2xl font-semibold mb-2 text-green-300">
          <span class="font-bold animate__heartBeat animate__animated animate__infinite">La app educativa</span>
          donde <span class="text-green-200 font-bold">despegas tu aprendizaje</span>
        </div>
        <div class="mb-2 text-green-200 text-lg font-normal max-w-xl">
          y retas tu <span class="text-green-400 font-bold">potencial</span>.
        </div>
        <div class="italic text-green-300 mb-5 mt-5 text-md md:text-lg font-medium">"Con Nitrosoft, cada día puedes superarte."</div>
        <div class="flex gap-4 mt-2">
          <a href="mailto:soporte@nitrosoft.com" class="group flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-500 text-white font-bold shadow transition">
            <span class="bi bi-envelope"></span>
            <span>Soporte</span>
          </a>
          <a href="https://www.nitrosoft.com/contacto" target="_blank" class="group flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-400 text-green-900 font-bold shadow transition">
            <span class="bi bi-person-lines-fill"></span>
            <span>Contacto</span>
          </a>
        </div>
        <div class="flex gap-3 mt-8 w-full">
          <a href="https://facebook.com" target="_blank" class="social-btn-fb" aria-label="Facebook login"><span class="bi bi-facebook text-2xl"></span></a>
          <a href="https://twitter.com" target="_blank" class="social-btn-tw" aria-label="Twitter login"><span class="bi bi-twitter text-2xl"></span></a>
          <a href="https://wa.me/1234567890" target="_blank" class="social-btn-wa" aria-label="WhatsApp contacto"><span class="bi bi-whatsapp text-2xl"></span></a>
          <a href="https://www.nitrosoft.com" target="_blank" class="social-btn-web" aria-label="Sitio Nitrosoft"><span class="bi bi-globe text-2xl"></span></a>
        </div>
      </section>
      <!-- Panel login derecha, nunca toca el footer -->
      <section class="w-full md:w-[500px] max-w-lg mx-auto md:ml-8 flex flex-col items-center justify-center"
               style="padding-bottom:40px; min-height:520px; max-height:97vh;">
        <div class="bg-black/90 backdrop-blur-xl border border-green-700 rounded-3xl shadow-2xl py-12 px-8 md:px-12 flex flex-col gap-7
            animate__animated animate__fadeInRightBig relative z-10"
            style="min-width:450px; max-height:600px; min-height:480px; margin-bottom: 0;">
          <h2 class="text-3xl font-bold text-center tracking-widest text-green-300 mb-4">Iniciar Sesión</h2>
          <form @submit.prevent="handleLogin" class="flex flex-col gap-6">
            <div class="relative mb-1">
              <input v-model="email" type="email" :placeholder="placeholderEmail" @focus="animInput('email')" @blur="resetInputAnim('email')"
                class="w-full py-4 px-5 rounded-md border border-green-800 bg-[#171717de] text-gray-200 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-600 transition-all peer" required autocomplete="email" />
              <div class="absolute top-0 left-4 text-green-500 text-xs pointer-events-none transition-all duration-300"
                :class="emailActive || email ? 'opacity-80 -translate-y-6 scale-105 font-bold' : 'opacity-0'">Escribe tu correo electrónico</div>
            </div>
            <div class="relative mb-1">
              <input v-model="password" type="password" :placeholder="placeholderPassword" @focus="animInput('password')" @blur="resetInputAnim('password')"
                class="w-full py-4 px-5 rounded-md border border-green-800 bg-[#171717de] text-gray-200 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-600 transition-all peer" required autocomplete="current-password" />
              <div class="absolute top-0 left-4 text-green-500 text-xs pointer-events-none transition-all duration-300"
                :class="passwordActive || password ? 'opacity-80 -translate-y-6 scale-105 font-bold' : 'opacity-0'">Tu contraseña segura aquí</div>
            </div>
            <label class="flex items-center gap-2 text-gray-200 text-sm select-none mt-1">
              <input type="checkbox" v-model="remember" class="accent-green-500 w-4 h-4" />
              Recordar credenciales
            </label>
            <button type="submit" :disabled="loading" class="w-full py-3 rounded-md bg-gradient-to-r from-green-600 to-green-400 text-lg font-bold text-white transition-all hover:from-green-700 hover:to-green-500 shadow-lg flex items-center justify-center gap-2 disabled:opacity-40">
              <span v-if="!loading">Iniciar Sesión</span>
              <svg v-else class="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
            </button>
            <button type="button" @click="loginGoogle" class="w-full py-3 rounded-md flex gap-3 items-center justify-center border border-green-700 hover:bg-green-900 transition font-bold text-green-300 bg-transparent">
              <span class="bi bi-google text-xl"></span>
              Iniciar con Google
            </button>
            <transition name="fade">
              <p v-if="error" class="text-center text-red-400 font-semibold mt-1">{{ error }}</p>
            </transition>
            <p class="text-center text-green-400 cursor-pointer text-sm mt-1 hover:underline">¿Olvidaste la contraseña?</p>
          </form>
        </div>
      </section>
    </div>
    <!-- ...MODALES... -->
    <footer class="fixed left-0 bottom-0 w-full text-center py-4 z-50"
            style="background: rgba(10,14,11,0.19); box-shadow: 0 4px 30px 0 #00390922;">
      <span class="text-green-500 text-base font-bold tracking-wider select-none" style="text-shadow:0 1px 4px #001b0a55;">
        © {{ year }} Nitrosoft — Aprende. Conecta. Progresa.
      </span>
    </footer>
  </div>
</template>


<script setup>
import { ref, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const email = ref('');
const password = ref('');
const remember = ref(false);
const error = ref('');
const loading = ref(false);
const emailActive = ref(false);
const passwordActive = ref(false);
const placeholderEmail = ref('Correo electrónico');
const placeholderPassword = ref('Contraseña');
const year = new Date().getFullYear();
const oscuro = ref(true);
const idioma = ref("es");

const mostrarRegistro = ref(false);
const datosGoogle = ref({});
const perfil = ref({ nombre: "", telefono: "", rol: "" });

const validNombre = ref(null);
const validRol = ref(null);
const modalSuccess = ref(false);

const router = useRouter();

const canSubmit = computed(() =>
  !!perfil.value.nombre && (!perfil.value.telefono || /^\d+$/.test(perfil.value.telefono)) && !!perfil.value.rol
);

watch(() => perfil.value.nombre, n => validNombre.value = n.length > 1 || n === "");
watch(() => perfil.value.rol, r => validRol.value = !!r || r === "");

const toggleDark = () => {
  oscuro.value = !oscuro.value;
  if (oscuro.value) document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
};

const animInput = campo => {
  if (campo === "email") emailActive.value = true;
  if (campo === "password") passwordActive.value = true;
};
const resetInputAnim = campo => {
  if (campo === "email" && !email.value) emailActive.value = false;
  if (campo === "password" && !password.value) passwordActive.value = false;
};

const handleLogin = async () => {
  error.value = '';
  loading.value = true;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    localStorage.setItem('token', userCredential.user.uid);
    router.push('/dashboard');
  } catch (err) {
    error.value = "Usuario o contraseña incorrectos";
  }
  loading.value = false;
};

const loginGoogle = async () => {
  error.value = '';
  loading.value = true;
  try {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    const userDoc = doc(db, "usuarios_perfil", cred.user.uid);
    const userSnap = await getDoc(userDoc);
    if (!userSnap.exists()) {
      datosGoogle.value = {
        uid: cred.user.uid,
        email: cred.user.email,
        photoURL: cred.user.photoURL
      };
      perfil.value = { nombre: "", telefono: "", rol: "" };
      mostrarRegistro.value = true;
    } else {
      router.push("/dashboard");
    }
  } catch {
    error.value = "Falló el login con Google";
  }
  loading.value = false;
};

const crearUsuarioGoogle = async () => {
  if (!canSubmit.value) return;
  loading.value = true;
  error.value = '';
  try {
    await setDoc(doc(db, "usuarios_perfil", datosGoogle.value.uid), {
      email: datosGoogle.value.email,
      nombre: perfil.value.nombre,
      telefono: perfil.value.telefono,
      rol: perfil.value.rol,
      photoURL: datosGoogle.value.photoURL || null,
      creado: new Date()
    });
    mostrarRegistro.value = false;
    modalSuccess.value = true;
  } catch {
    error.value = "No se pudo registrar el usuario. Inténtalo de nuevo.";
  }
  loading.value = false;
};

const irDashboard = () => {
  modalSuccess.value = false;
  router.push("/dashboard");
};
</script>

<style scoped>
.input-nitro {
  @apply w-full py-3 px-4 rounded-md border border-green-800 bg-[#161717] text-gray-200 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-600 mb-2;
}
.nitro-bg-dark {
  background: #0B0F0B;
  min-height: 100vh;
  min-width: 100vw;
  overflow-x: hidden;
}
.nitro-aurora-bg {
  background:
    radial-gradient(ellipse at 70% 20%, #29ffae44 0%, #163a2b12 40%, transparent 70%),
    radial-gradient(ellipse at 0% 100%, #00c48f30 5%, #163a2b16 40%, transparent 70%),
    linear-gradient(140deg, #111810 60%, #0b311b 110%);
  animation: nitro-bg-aura 14s cubic-bezier(.57,.37,.57,.96) infinite alternate;
}
@keyframes nitro-bg-aura {
  0% { background-position: 0% 0%, 80% 80%, 0 0; filter: brightness(1) blur(0);}
  35% { filter: brightness(1.05) blur(1.5px);}
  100% { background-position: 50% 80%, 30% 100%, 100% 0; filter: brightness(0.97) blur(1.5px);}
}
.social-btn-fb, .social-btn-tw, .social-btn-wa, .social-btn-web {
  @apply border-2 rounded-full p-2 transition hover:bg-green-700 hover:text-white;
  border-color: #19e59a !important;
  background: #151c18;
  color: #19e59a;
}
.social-btn-fb:hover { background: #1877f2 !important; color: #fff !important;}
.social-btn-tw:hover { background: #1da1f2 !important; color: #fff !important;}
.social-btn-wa:hover { background: #25d366 !important; color: #fff !important;}
.social-btn-web:hover { background: #22c55e !important; color: #00390d !important;}
.fade-enter-active, .fade-leave-active { transition: opacity 0.29s; }
.fade-enter-from, .fade-leave-to { opacity: 0;}
</style>
