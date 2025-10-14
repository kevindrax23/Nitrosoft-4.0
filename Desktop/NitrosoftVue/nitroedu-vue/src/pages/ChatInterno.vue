<template>
  <div class="min-h-[80vh] w-full flex justify-center items-start bg-gradient-to-br from-black via-[#141914] to-green-950 px-0 py-10">
    <div class="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-6 bg-transparent">

      <!-- Lista de usuarios/contactos -->
      <aside class="bg-black/80 md:rounded-l-3xl rounded-b-3xl md:rounded-br-none border border-green-700 md:border-r-0 shadow-lg p-2 pt-6 flex flex-col min-h-[60vh]">
        <div class="text-lg font-bold text-green-300 mb-3 px-3 animate__animated animate__fadeInLeft">Chats</div>
        <input
          v-model="busqueda"
          placeholder="Buscar usuario..."
          class="w-full py-2 px-4 mb-3 rounded-lg bg-[#101910] border border-green-600 text-green-200 focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <div class="overflow-y-auto flex-1 pr-1">
          <div
            v-for="user in usuariosFiltrados"
            :key="user.id"
            @click="abrirChat(user)"
            :class="[
              'flex gap-3 items-center px-3 py-3 rounded-xl cursor-pointer hover:bg-green-950/40 transition select-none mb-2 animate__animated',
              chatActivo && chatActivo.id === user.id ? 'bg-gradient-to-r from-green-900/90 to-green-700/80 text-green-300 shadow-lg animate__pulse' : 'animate__fadeInLeft'
            ]"
          >
            <div class="w-11 h-11 rounded-full bg-green-800 flex items-center justify-center text-xl font-bold text-green-50 uppercase animate__animated animate__jackInTheBox">
              {{ user.nombre.slice(0,2) }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="font-bold truncate">{{ user.nombre }}</div>
              <div class="text-xs text-green-300 truncate" v-if="user.ultimoMensaje">
                {{ user.ultimoMensaje.texto || '' }}
              </div>
            </div>
            <transition name="bounce">
              <div v-if="user.nuevosMensajes" class="w-6 h-6 rounded-full flex items-center justify-center bg-green-500 text-black font-bold text-sm animate__animated animate__bounce">
                {{ user.nuevosMensajes }}
              </div>
            </transition>
          </div>
        </div>
      </aside>

      <!-- Ventana central de chat -->
      <main class="col-span-2 flex flex-col h-[70vh] min-h-[460px] bg-black/85 rounded-3xl border border-green-700 shadow-lg overflow-hidden">
        <div class="flex items-center bg-gradient-to-r from-green-950 to-green-900 px-8 py-3 border-b border-green-700 min-h-[60px]">
          <div v-if="chatActivo" class="flex items-center gap-4 w-full animate__animated animate__fadeInDown">
            <div class="w-10 h-10 rounded-full bg-green-700 text-green-50 flex items-center justify-center font-bold text-lg uppercase animate__animated animate__headShake">{{ chatActivo.nombre.slice(0,2) }}</div>
            <span class="text-green-200 font-semibold text-lg">{{ chatActivo.nombre }}</span>
            <span v-if="escribiendo" class="ml-5 text-green-400 animate__animated animate__flash animate__infinite">escribiendo...</span>
            <span class="ml-auto text-green-400 text-xs">online</span>
          </div>
          <div v-else class="text-green-400 text-center w-full">Selecciona un usuario para chatear</div>
        </div>
        <div class="flex-1 px-8 pb-4 pt-4 overflow-y-auto space-y-2 relative" ref="scrollRef">
          <div v-if="!chatActivo" class="h-full flex items-center justify-center text-green-300 font-semibold animate__animated animate__fadeIn">
            ¿Listo para conversar con tu comunidad educativa? 🚀
          </div>
          <transition-group name="msg" tag="div">
            <div
              v-for="(msg, idx) in mensajesChatActivo"
              :key="msg.fecha + '_' + idx"
              :class="['flex w-full mb-1 animate__animated', msg.emisor === miUsuario.id ? 'justify-end animate__fadeInRight' : 'justify-start animate__fadeInLeft']"
            >
              <div
                :class="[
                  'rounded-xl py-2 px-4 max-w-[80%] relative shadow-xl transition-[transform]',
                  msg.emisor === miUsuario.id
                    ? 'bg-gradient-to-br from-green-700 to-green-400 text-white ml-auto scale-105 hover:scale-110'
                    : 'bg-[#1a2821] text-green-100 mr-auto scale-105 hover:scale-110'
                ]"
              >
                <div class="text-sm whitespace-pre-line">{{ msg.texto }}</div>
                <div class="text-[11px] absolute bottom-1 right-2 text-green-200/70">{{ horaMsg(msg.fecha) }}</div>
              </div>
            </div>
          </transition-group>
        </div>
        <div v-if="chatActivo" class="p-6 bg-gradient-to-tr from-black to-green-900 border-t border-green-800 relative">
          <div v-if="msgNotification" class="absolute -top-10 left-4 bg-green-700 text-white px-4 py-2 rounded-xl shadow animate__animated animate__bounceInDown">
            {{ msgNotification }}
          </div>
          <form @submit.prevent="enviarMensaje" class="flex gap-3 w-full items-center animate__animated animate__fadeInUp">
            <input
              v-model="nuevoMensaje"
              type="text"
              placeholder="Escribe un mensaje educativo..."
              class="flex-1 py-2 px-4 rounded-lg bg-[#161e16] border border-green-500 text-green-200 focus:outline-none focus:ring-2 focus:ring-green-600"
              autocomplete="off"
              maxlength="400"
              @input="empezarEscribir"
              @blur="pararEscribir"
            />
            <button
              type="submit"
              :disabled="!nuevoMensaje.trim()"
              class="px-4 py-2 font-bold rounded-lg bg-gradient-to-r from-green-600 to-green-400 text-white shadow hover:from-green-700 hover:to-green-500 transition disabled:opacity-60"
            >Enviar</button>
          </form>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import 'animate.css'; // Asegúrate de importar animate.css

// Usuario simulado
const miUsuario = { id: 'u123', nombre: 'Yo Mismo' };
const usuarios = ref([
  { id: 'u123', nombre: 'Yo Mismo' },
  { id: 'u456', nombre: 'Juan Pérez' },
  { id: 'u789', nombre: 'Sandra Rivera' },
  { id: 'u111', nombre: 'Profe Laura' },
  { id: 'u222', nombre: 'Luis Mata' },
  { id: 'u333', nombre: 'Karla Torres' },
]);

const chats = ref({
  u456: [
    { emisor: 'u456', texto: '¡Hola! ¿Cómo vas en matemáticas?', fecha: Date.now() - 70000 },
    { emisor: 'u123', texto: '¡Muy bien! ¿Y tú?', fecha: Date.now() - 68000 },
    { emisor: 'u456', texto: 'Preparando para el examen 💪', fecha: Date.now() - 50000 }
  ],
  u789: [
    { emisor: 'u789', texto: '¿Viste la tarea de geometría?', fecha: Date.now() - 999000 }
  ]
});
const chatActivo = ref(null);
const nuevoMensaje = ref('');
const busqueda = ref('');
const scrollRef = ref(null);
const escribiendo = ref(false);
const msgNotification = ref('');

// Animación de badge para nuevos mensajes
const usuariosFiltrados = computed(() => {
  return usuarios.value
    .filter(u => u.id !== miUsuario.id && u.nombre.toLowerCase().includes(busqueda.value.toLowerCase()))
    .map(u => ({
      ...u,
      ultimoMensaje: (chats.value[u.id] && chats.value[u.id][chats.value[u.id].length - 1]) || {},
      nuevosMensajes: chats.value[u.id] ? chats.value[u.id].filter(m => m.emisor === u.id && !m.visto).length : 0
    }));
});

const mensajesChatActivo = computed(() => {
  if (!chatActivo.value) return [];
  return chats.value[chatActivo.value.id] || [];
});

function abrirChat(user) {
  chatActivo.value = user;
  if (chats.value[user.id]) {
    chats.value[user.id].forEach(m => { if (m.emisor === user.id) m.visto = true; });
  }
  nextTick(() => {
    if (scrollRef.value) scrollRef.value.scrollTop = scrollRef.value.scrollHeight;
  });
}

function enviarMensaje() {
  if (!nuevoMensaje.value.trim() || !chatActivo.value) return;
  if (!chats.value[chatActivo.value.id]) chats.value[chatActivo.value.id] = [];
  chats.value[chatActivo.value.id].push({
    emisor: miUsuario.id,
    texto: nuevoMensaje.value,
    fecha: Date.now()
  });
  // Notificación enviada
  msgNotification.value = "Mensaje enviado 🚀";
  setTimeout(() => { msgNotification.value = ''; }, 1100);
  nuevoMensaje.value = '';
  escribiendo.value = false;
  nextTick(() => {
    if (scrollRef.value) scrollRef.value.scrollTop = scrollRef.value.scrollHeight;
  });
}

function horaMsg(fecha) {
  if (!fecha) return '';
  const d = new Date(fecha);
  return d.getHours().toString().padStart(2, '0') + ':' +
         d.getMinutes().toString().padStart(2, '0');
}

let escritaTimeout;
function empezarEscribir() {
  escribiendo.value = true;
  clearTimeout(escritaTimeout);
  escritaTimeout = setTimeout(() => { escribiendo.value = false }, 1900);
}
function pararEscribir() {
  escribiendo.value = false;
}

// Demo: abre primer chat automáticamente
onMounted(() => {
  if (usuariosFiltrados.value.length) {
    abrirChat(usuariosFiltrados.value[0]);
  }
});
</script>

<style scoped>
/* Animación bounce de badge */
@keyframes bounceBadge {
  0%, 20%, 53%, 80%, 100% { transform: translateY(0);}
  40%, 43% { transform: translateY(-20px);}
  70% { transform: translateY(-8px);}
  90% { transform: translateY(-4px);}
}
.bounce-enter-active {
  animation: bounceBadge 1s;
}
.bounce-leave-active {
  animation: bounceBadge 1s reverse;
}
/* Transición de aparición de mensajes */
.msg-enter-active, .msg-leave-active {
  transition: all 0.2s;
}
.msg-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}
.msg-enter-to {
  opacity: 1;
  transform: none;
}
.msg-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}
</style>
