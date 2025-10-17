<template>
  <div class="min-h-screen bg-gradient-to-br from-black via-[#171819] to-[#232323] px-2 py-10 flex justify-center items-start">
    <div class="max-w-7xl w-full">
      <h1 class="text-center text-4xl font-extrabold text-green-400 mb-6">Configuración de Usuario</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

        <!-- TEMA -->
        <section class="bg-[#181a1a] p-7 rounded-2xl border border-green-700 shadow flex flex-col min-h-[210px] gap-5">
          <h2 class="text-2xl font-bold text-green-300 mb-2">Tema</h2>
          <label class="cursor-pointer flex items-center gap-3">
            <input type="checkbox" class="accent-green-400 h-6 w-6" v-model="oscuro" />
            <span class="text-lg">{{ oscuro ? 'Oscuro' : 'Claro' }}</span>
          </label>
          <div class="mt-2 text-green-400 text-xs">Visualiza la app a tu gusto</div>
        </section>

        <!-- IDIOMA -->
        <section class="bg-[#181a1a] p-7 rounded-2xl border border-green-700 shadow flex flex-col min-h-[210px] gap-5">
          <h2 class="text-2xl font-bold text-green-300 mb-2">Idioma</h2>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="item in idiomasDisponibles"
              :key="item.code"
              @click="setIdioma(item.code)"
              :class="['rounded-lg px-2 py-1 border transition', idioma === item.code ? 'border-green-400 bg-[#192d19] scale-105' : 'border-green-700 hover:bg-green-800/60']"
            >
              <span class="mr-1">{{ item.flag }}</span>
              <span class="font-semibold">{{ item.name }}</span>
              <span v-if="idioma === item.code" class="ml-2 text-green-300 font-extrabold animate__animated animate__tada">✔</span>
            </button>
          </div>
          <transition name="fade">
            <div v-if="idiomaChanged" class="mt-2 text-green-400 text-xs font-semibold">{{ idiomaFeedback }}</div>
          </transition>
        </section>

        <!-- NOTIFICACIONES -->
        <section class="bg-[#181a1a] p-7 rounded-2xl border border-green-700 shadow flex flex-col min-h-[210px] gap-5">
          <h2 class="text-2xl font-bold text-green-300 mb-2">Notificaciones</h2>
          <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" class="accent-green-400 h-6 w-6" v-model="notificaciones" />
            <span class="text-lg">Notif. educativas</span>
          </label>
          <div v-if="notificaciones" class="mt-1 text-green-400 text-xs animate__animated animate__fadeIn">Te avisaremos de tareas, notas, etc.</div>
        </section>

        <!-- ACCESIBILIDAD -->
        <section class="bg-[#181a1a] p-7 rounded-2xl border border-green-700 shadow flex flex-col min-h-[210px] gap-5">
          <h2 class="text-2xl font-bold text-green-300 mb-2">Accesibilidad</h2>
          <label class="block mb-2 text-green-300 font-semibold">Tamaño de fuente</label>
          <input
            type="range"
            min="12"
            max="22"
            v-model="tamanoFuente"
            @input="ajustarTamanoFuente"
            class="accent-green-400 w-full"
          />
          <div class="mt-1 text-green-400 text-sm">Actual: {{ tamanoFuente }} px</div>
        </section>

        <!-- CUENTA -->
        <section class="bg-[#181a1a] p-7 rounded-2xl border border-green-700 shadow flex flex-col min-h-[210px] gap-5">
          <h2 class="text-2xl font-bold text-green-300 mb-2">Cuenta</h2>
          <div class="mb-1 text-green-200 text-sm font-semibold">Email:</div>
          <input
            type="email"
            v-model="email"
            class="w-full py-2 px-3 rounded-lg bg-[#191d1c] border border-green-700 text-green-300 mb-2"
            placeholder="usuario@ejemplo.com"
            @blur="persistAccount"
          />
          <div class="flex gap-2">
            <button @click="guardarEmail" class="w-1/2 py-2 bg-green-700 hover:bg-green-800 rounded-lg font-bold text-white">Actualizar Email</button>
            <button @click="showChangePass = true" class="w-1/2 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-bold text-white">Cambiar Clave</button>
          </div>
          <transition name="fade"><div v-if="emailSaved" class="mt-1 text-green-400 text-xs text-center">¡Email actualizado!</div></transition>
        </section>

        <!-- PRIVACIDAD/DATOS -->
        <section class="bg-[#181a1a] p-7 rounded-2xl border border-green-700 shadow flex flex-col min-h-[210px] gap-5">
          <h2 class="text-2xl font-bold text-green-300 mb-2">Privacidad y Datos</h2>
          <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" class="accent-green-400 h-6 w-6" v-model="analytics" />
            <span class="text-lg">Enviar datos de uso anónimos</span>
          </label>
          <button class="my-3 w-full py-2 bg-red-700 hover:bg-red-800 rounded-lg font-bold text-white transition" @click="borrarLocal">
            Borrar datos locales
          </button>
          <button class="w-full py-2 bg-green-700 hover:bg-green-800 rounded-lg font-bold text-white transition" @click="resetAll">
            Resetear configuración
          </button>
          <div v-if="resetFeedback" class="mt-1 text-green-400 text-xs">{{ resetFeedback }}</div>
        </section>

        <!-- SESIÓN -->
        <section class="bg-[#181a1a] p-7 rounded-2xl border border-green-700 shadow flex flex-col gap-5 min-h-[210px] justify-end">
          <h2 class="text-2xl font-bold text-green-300 mb-2">Sesión</h2>
          <button
            @click="showConfirmLogout = true"
            class="w-full py-3 rounded-lg bg-gradient-to-r from-red-700 to-red-900 text-lg font-bold text-white shadow hover:from-red-800 hover:to-red-800 transition mt-auto"
          >
            Cerrar sesión
          </button>
        </section>
      </div>

      <!-- Cambiar clave -->
      <div v-if="showChangePass" class="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
        <div class="bg-black rounded-2xl p-8 max-w-md w-full space-y-4 border border-green-700 shadow-lg">
          <h3 class="text-green-400 text-2xl font-bold text-center">Cambiar Contraseña</h3>
          <input type="password" v-model="nuevaClave" placeholder="Nueva contraseña" class="w-full p-3 rounded-lg bg-[#191d1c] border border-green-700 text-green-300 font-semibold"/>
          <input type="password" v-model="confirmarClave" placeholder="Confirmar contraseña" class="w-full p-3 rounded-lg bg-[#191d1c] border border-green-700 text-green-300 font-semibold"/>
          <div class="flex justify-between mt-2">
            <button @click="cambiarClave" class="py-2 px-4 bg-green-700 rounded-lg font-bold text-white hover:bg-green-800 transition">
              Cambiar
            </button>
            <button @click="showChangePass = false" class="py-2 px-4 bg-red-700 rounded-lg font-bold text-white hover:bg-red-800 transition">
              Cancelar
            </button>
          </div>
          <div v-if="passError" class="text-red-500 text-sm mt-2 text-center">{{ passError }}</div>
          <div v-if="passSuccess" class="text-green-400 text-sm mt-2 text-center">{{ passSuccess }}</div>
        </div>
      </div>
      <!-- Confirmar logout -->
      <div v-if="showConfirmLogout" class="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
        <div class="bg-black rounded-2xl p-8 max-w-md w-full border border-green-700 shadow-lg text-center space-y-4">
          <h3 class="text-green-400 text-xl font-bold mb-4">¿Cerrar sesión?</h3>
          <div class="flex justify-between">
            <button @click="cerrarSesion" class="py-2 px-6 bg-red-700 rounded-lg font-bold text-white hover:bg-red-800 transition">Sí, cerrar</button>
            <button @click="showConfirmLogout = false" class="py-2 px-6 bg-green-700 rounded-lg font-bold text-white hover:bg-green-800 transition">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { getAuth, updatePassword } from 'firebase/auth';

const oscuro = ref(localStorage.getItem('modoOscuro') !== 'false');
const idioma = ref(localStorage.getItem('idioma') || 'es');
const idiomasDisponibles = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];
const idiomaFeedback = ref('');
const idiomaChanged = ref(false);

const notificaciones = ref(localStorage.getItem('notificaciones') !== 'false');
const tamanoFuente = ref(+localStorage.getItem('tamanoFuente') || 16);

const email = ref(localStorage.getItem('email') || 'usuario@ejemplo.com');
const emailSaved = ref(false);

const analytics = ref(localStorage.getItem('analytics') !== 'false');
const resetFeedback = ref('');

const showChangePass = ref(false);
const showConfirmLogout = ref(false);
const nuevaClave = ref('');
const confirmarClave = ref('');
const passError = ref('');
const passSuccess = ref('');

// Tema automático reactivo
watch(oscuro, v => {
  document.documentElement.classList.toggle('dark', v);
  localStorage.setItem('modoOscuro', v);
});
if (oscuro.value) document.documentElement.classList.add('dark');
else document.documentElement.classList.remove('dark');

// Idioma
const setIdioma = c => {
  idioma.value = c;
  localStorage.setItem('idioma', c);
  idiomaFeedback.value = `Idioma cambiado a ${idiomasDisponibles.find(i => i.code === c).name}`;
  idiomaChanged.value = true;
  setTimeout(() => idiomaChanged.value = false, 1800);
};

// Notificaciones, analytics y fuente
watch(notificaciones, v => localStorage.setItem('notificaciones', v));
watch(analytics, v => localStorage.setItem('analytics', v));
watch(tamanoFuente, v => {
  document.documentElement.style.fontSize = `${v}px`;
  localStorage.setItem('tamanoFuente', v);
});
document.documentElement.style.fontSize = `${tamanoFuente.value}px`;

// Cuenta/Email
const guardarEmail = () => {
  localStorage.setItem('email', email.value);
  emailSaved.value = true;
  setTimeout(() => (emailSaved.value = false), 1400);
};
const persistAccount = () => {
  localStorage.setItem('email', email.value);
};

// Cambiar clave Firebase Auth
const cambiarClave = async () => {
  passError.value = '';
  passSuccess.value = '';
  if (nuevaClave.value.length < 6) return (passError.value = 'Mínimo 6 caracteres');
  if (nuevaClave.value !== confirmarClave.value) return (passError.value = 'No coinciden');
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      passError.value = 'Usuario no autenticado';
      return;
    }
    await updatePassword(user, nuevaClave.value);
    passSuccess.value = 'Contraseña cambiada correctamente';
    setTimeout(() => { showChangePass.value = false; nuevaClave.value=''; confirmarClave.value=''; passSuccess.value=''; }, 1300);
  } catch (e) {
    passError.value = e.message || 'Error al cambiar clave';
  }
};

// Datos y reset
const borrarLocal = () => {
  localStorage.clear();
  resetFeedback.value = '¡Datos locales borrados!';
  setTimeout(() => (resetFeedback.value = ''), 1700);
};
const resetAll = () => {
  oscuro.value = true;
  idioma.value = 'es';
  analytics.value = true;
  notificaciones.value = true;
  tamanoFuente.value = 16;
  email.value = 'usuario@ejemplo.com';
  localStorage.clear();
  resetFeedback.value = '¡Configuraciones restauradas!';
  setTimeout(() => (resetFeedback.value = ''), 1400);
};

// Sesión (simulado)
const cerrarSesion = () => {
  showConfirmLogout.value = false;
  resetFeedback.value = 'Sesión cerrada (implementa logout real)';
  setTimeout(() => (resetFeedback.value = ''), 2000);
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.18s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
