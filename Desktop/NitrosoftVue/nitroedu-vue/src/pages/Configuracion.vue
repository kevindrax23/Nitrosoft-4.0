<template>
  <div class="min-h-screen bg-gradient-to-br from-black via-[#141914] to-green-950 px-5 py-10 flex justify-center items-start">
    <div class="max-w-7xl w-full">
      <h1 class="text-center text-4xl font-extrabold text-green-400 mb-8">Configuración General</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

        <!-- TEMA -->
        <section class="bg-[#161e16] p-7 rounded-2xl border border-green-700 shadow flex flex-col gap-6 min-h-[220px]">
          <h2 class="text-2xl font-bold text-green-300 mb-2">Tema</h2>
          <label class="cursor-pointer flex items-center no-underline">
            <input type="checkbox" class="accent-green-400 h-6 w-6" v-model="oscuro" @change="toggleTema" />
            <span class="ml-3 text-green-200 text-lg transition">{{ oscuro ? 'Oscuro' : 'Claro' }}</span>
          </label>
          <div class="mt-2 text-green-400 text-xs">La preferencia se guarda localmente</div>
        </section>

        <!-- IDIOMA -->
        <section class="bg-[#161e16] p-7 rounded-2xl border border-green-700 shadow flex flex-col gap-4 min-h-[220px]">
          <h2 class="text-2xl font-bold text-green-300 mb-2">Idioma</h2>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="item in idiomasDisponibles"
              :key="item.code"
              @click="seleccionarIdioma(item.code)"
              :class="['rounded-lg px-2 py-1 border text-left', selectedIdioma === item.code ? 'border-green-400 bg-green-900' : 'border-green-600 hover:bg-green-700/60']"
            >
              <span class="mr-2">{{ item.flag }}</span>
              <span class="font-semibold text-green-100">{{ item.name }}</span>
            </button>
          </div>
          <div v-if="msgIdioma && mostrarMsg" class="mt-2 text-green-400 text-xs font-semibold">{{ msgIdioma }}</div>
        </section>

        <!-- NOTIFICACIONES -->
        <section class="bg-[#161e16] p-7 rounded-2xl border border-green-700 shadow flex flex-col gap-6 min-h-[220px]">
          <h2 class="text-2xl font-bold text-green-300 mb-2">Notificaciones</h2>
          <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" class="accent-green-400 h-6 w-6" v-model="notificacionesActivas" @change="toggleNotificaciones" />
            <span class="text-green-200 text-lg">Activar push educativas</span>
          </label>
          <div v-if="notificacionesActivas" class="mt-2 text-green-400 text-xs">Recibe alertas de exámenes, clases y más.</div>
        </section>

        <!-- ACCESIBILIDAD -->
        <section class="bg-[#161e16] p-7 rounded-2xl border border-green-700 shadow flex flex-col gap-4 min-h-[220px]">
          <h2 class="text-2xl font-bold text-green-300 mb-2">Accesibilidad</h2>
          <label class="block mb-2 text-green-300 font-semibold">Tamaño de fuente</label>
          <input
            type="range"
            min="12"
            max="24"
            v-model="tamanoFuente"
            @input="ajustarTamanoFuente"
            class="accent-green-400 w-full"
          />
          <p class="mt-1 text-green-400 text-sm">Actual: {{ tamanoFuente }} px</p>
        </section>

        <!-- CUENTA -->
        <section class="bg-[#161e16] p-7 rounded-2xl border border-green-700 shadow flex flex-col gap-5 min-h-[220px]">
          <h2 class="text-2xl font-bold text-green-300 mb-2">Cuenta</h2>
          <label class="block text-green-200 mb-1 text-sm font-semibold">Email:</label>
          <input
            type="email"
            v-model="email"
            class="w-full py-2 px-3 rounded-lg bg-[#101910] border border-green-600 text-green-300 font-semibold"
            placeholder="usuario@ejemplo.com"
          />
          <button @click="guardarEmail"
            class="mt-1 w-full py-2 bg-green-700 hover:bg-green-800 rounded-lg font-bold text-white transition">Actualizar Email</button>
          <button @click="mostrarModalCambioClave = true"
            class="w-full py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-bold text-white transition">Cambiar Contraseña</button>
        </section>

        <!-- PRIVACIDAD Y DATOS -->
        <section class="bg-[#161e16] p-7 rounded-2xl border border-green-700 shadow flex flex-col gap-5 min-h-[220px]">
          <h2 class="text-2xl font-bold text-green-300 mb-2">Privacidad/Datos</h2>
          <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" class="accent-green-400 h-6 w-6" v-model="analyticsActivas" @change="toggleAnalytics"/>
            <span class="text-green-200 text-lg">Enviar datos de uso anónimos</span>
          </label>
          <button class="w-full py-2 bg-red-700 hover:bg-red-800 rounded-lg font-bold text-white transition" @click="borrarDatosLocal">
            Borrar datos locales
          </button>
          <button class="w-full py-2 bg-gradient-to-r from-green-700 to-green-500 hover:from-green-800 hover:to-green-600 rounded-lg font-bold text-white transition" @click="resetConfiguracion">
            Resetear configuración
          </button>
        </section>

        <!-- SESIÓN -->
        <section class="bg-[#161e16] p-7 rounded-2xl border border-green-700 shadow flex flex-col gap-6 min-h-[220px] justify-end">
          <h2 class="text-2xl font-bold text-green-300 mb-2">Sesión</h2>
          <button
            @click="confirmarCerrarSesion"
            class="w-full py-3 rounded-lg bg-gradient-to-r from-red-700 to-red-900 text-lg font-bold text-white shadow hover:from-red-800 hover:to-red-800 transition"
          >
            Cerrar sesión
          </button>
        </section>
      </div>

      <!-- Modal cambio clave -->
      <div v-if="mostrarModalCambioClave" class="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 px-4">
        <div class="bg-black rounded-2xl p-8 max-w-md w-full space-y-4 border border-green-700 shadow-lg">
          <h3 class="text-green-400 text-2xl font-bold text-center">Cambiar Contraseña</h3>
          <input type="password" v-model="nuevaClave" placeholder="Nueva contraseña" class="w-full p-3 rounded-lg bg-[#101910] border border-green-600 text-green-300 font-semibold"/>
          <input type="password" v-model="confirmarClave" placeholder="Confirmar contraseña" class="w-full p-3 rounded-lg bg-[#101910] border border-green-600 text-green-300 font-semibold"/>
          <div class="flex justify-between mt-2">
            <button @click="cambiarClave" class="py-2 px-4 bg-green-600 rounded-lg font-bold text-white hover:bg-green-700 transition">
              Cambiar
            </button>
            <button @click="mostrarModalCambioClave = false" class="py-2 px-4 bg-red-600 rounded-lg font-bold text-white hover:bg-red-700 transition">
              Cancelar
            </button>
          </div>
          <div v-if="mensajeError" class="text-red-500 text-sm mt-2 text-center">{{ mensajeError }}</div>
        </div>
      </div>

      <!-- Confirmar cerrar sesión -->
      <div v-if="mostrarConfirmacionCerrarSesion" class="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 px-4">
        <div class="bg-black rounded-2xl p-8 max-w-md w-full space-y-4 border border-green-700 shadow-lg text-center">
          <h3 class="text-green-400 text-xl font-bold mb-4">¿Estás seguro de cerrar sesión?</h3>
          <div class="flex justify-between">
            <button @click="cerrarSesion" class="py-2 px-6 bg-red-700 rounded-lg font-bold text-white hover:bg-red-800 transition">Sí, cerrar sesión</button>
            <button @click="mostrarConfirmacionCerrarSesion = false" class="py-2 px-6 bg-green-600 rounded-lg font-bold text-white hover:bg-green-700 transition">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const oscuro = ref(true);
const idioma = ref('es');
const analyticsActivas = ref(true);
const notificacionesActivas = ref(true);
const tamanoFuente = ref(16);
const email = ref('usuario@ejemplo.com');
const nuevaClave = ref('');
const confirmarClave = ref('');
const mostrarModalCambioClave = ref(false);
const mensajeError = ref('');
const mostrarConfirmacionCerrarSesion = ref(false);

const idiomasDisponibles = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];
const selectedIdioma = ref(idioma.value);

function toggleTema() {
  if (oscuro.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem('modoOscuro', oscuro.value);
}
watch(oscuro, toggleTema);

let mostrarMsg = false;
let msgIdioma = '';
function seleccionarIdioma(code) {
  idioma.value = code;
  selectedIdioma.value = code;
  mostrarMsg = true;
  msgIdioma = `Idioma cambiado a ${idiomasDisponibles.find(i => i.code === code).name}`;
  setTimeout(() => { mostrarMsg = false }, 2500);
}
function toggleNotificaciones() {
  alert(`Notificaciones ${notificacionesActivas.value ? 'activadas' : 'desactivadas'}`);
}
function toggleAnalytics() {
  alert(`Análisis de uso ${analyticsActivas.value ? 'activados' : 'desactivados'}`);
}
function ajustarTamanoFuente() {
  document.documentElement.style.fontSize = `${tamanoFuente.value}px`;
  localStorage.setItem('tamanoFuente', tamanoFuente.value);
}
function guardarEmail() {
  alert(`Email guardado: ${email.value}`);
}
function cambiarClave() {
  mensajeError.value = '';
  if (nuevaClave.value.length < 6) {
    mensajeError.value = 'La nueva contraseña debe tener al menos 6 caracteres';
    return;
  }
  if (nuevaClave.value !== confirmarClave.value) {
    mensajeError.value = 'Las contraseñas no coinciden';
    return;
  }
  alert('Contraseña cambiada con éxito');
  mostrarModalCambioClave.value = false;
  nuevaClave.value = '';
  confirmarClave.value = '';
}
function borrarDatosLocal() {
  localStorage.clear();
  alert('Datos locales borrados. Recarga la página.');
}
function resetConfiguracion() {
  oscuro.value = true;
  idioma.value = 'es';
  analyticsActivas.value = true;
  notificacionesActivas.value = true;
  tamanoFuente.value = 16;
  ajustarTamanoFuente();
  selectedIdioma.value = 'es';
  alert('Configuración reiniciada a valores predeterminados.');
}
function confirmarCerrarSesion() {
  mostrarConfirmacionCerrarSesion.value = true;
}
function cerrarSesion() {
  alert('Sesión cerrada. Aquí deberías implementar el logout real.');
  mostrarConfirmacionCerrarSesion.value = false;
}
if (localStorage.getItem('modoOscuro') === 'false') {
  oscuro.value = false;
  document.documentElement.classList.remove('dark');
} else {
  oscuro.value = true;
  document.documentElement.classList.add('dark');
}
tamanoFuente.value = localStorage.getItem('tamanoFuente')
  ? parseInt(localStorage.getItem('tamanoFuente'))
  : 16;
ajustarTamanoFuente();
</script>
