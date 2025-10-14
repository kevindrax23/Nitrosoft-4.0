<template>
  <div class="w-full flex flex-col items-center py-8 bg-black/40 rounded-xl ring-1 ring-green-700 my-6">
    <h3 class="text-2xl text-green-400 mb-4 font-bold">Simulador Interactivo: Movimiento Rectilíneo Uniforme (MRU)</h3>
    <p class="text-green-200 mb-4 text-center">
      Ajusta la velocidad, elige la unidad y observa la relación entre <span class="font-bold text-green-400">posición, velocidad y tiempo</span>. <br>
      ¡Al terminar, responde el reto!
    </p>

    <!-- Controles -->
    <div class="flex flex-wrap gap-6 justify-center items-center mb-6 w-full">
      <label class="text-green-300 text-lg flex gap-2 items-center">
        Velocidad:
        <input type="range" min="1" max="20" v-model="velocidadInput" class="accent-green-400 w-36">
        <span>{{ velocidadInput }} {{ unidadVelocidad }}</span>
      </label>
      <label class="text-green-300 text-lg flex gap-2 items-center">
        Unidad:
        <select v-model="seleccionUnidad" class="rounded bg-gray-900 border-green-400 text-green-400">
          <option value="px/s">px/s</option>
          <option value="m/s">m/s</option>
          <option value="km/h">km/h</option>
        </select>
      </label>
      <label class="text-green-300 text-lg flex gap-2 items-center">
        Color:
        <input type="color" v-model="color" class="w-8 h-8 rounded-full border border-green-400 ml-2">
      </label>
    </div>

    <!-- Trayectoria con canvas -->
    <div class="relative w-full max-w-3xl h-36 bg-[#101d10] overflow-hidden border border-green-600 rounded-lg mb-1">
      <canvas ref="trayectoriaCanvas" class="absolute z-0 left-0 top-0" width="900" height="100"/>
      <div
        class="h-12 w-12 rounded-full absolute z-10 top-1/2 transform -translate-y-1/2 border-2 border-green-500 flex items-center justify-center text-white text-lg font-bold"
        :style="{
          left: posX + 'px',
          background: color,
          transition: running ? 'left 0.03s linear' : 'none'
        }"
      >
        🚗
      </div>
      <div class="absolute bottom-1 right-4 text-xs text-green-300">Fin ({{ trayectoMax }} px)</div>
      <div class="absolute bottom-1 left-4 text-xs text-green-300">Inicio (0 px)</div>
    </div>

    <!-- Barra de progreso -->
    <div class="w-full max-w-3xl h-2 bg-green-900/70 rounded-full my-1">
      <div
        class="h-2 rounded-full bg-gradient-to-r from-green-400 to-green-700"
        :style="{ width: ((posX / trayectoMax) * 100).toFixed(1) + '%'}"
      ></div>
    </div>

    <!-- Controles -->
    <div class="mt-6 flex gap-4">
      <button @click="iniciar" :disabled="running" class="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold shadow">
        Iniciar
      </button>
      <button @click="detener" :disabled="!running" class="px-5 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-bold shadow">
        Detener
      </button>
      <button @click="reset" class="px-5 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-bold shadow">
        Reiniciar
      </button>
    </div>

    <!-- Datos en tiempo real -->
    <div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl text-green-200 text-lg text-center">
      <div>Posición: {{ posX.toFixed(1) }} px ({{ metros }} m)</div>
      <div>Velocidad: {{ velocidadDisplay }}</div>
      <div>Tiempo: {{ tiempo.toFixed(2) }} s</div>
    </div>
    <div class="text-green-400 mt-3 font-mono text-lg flex items-center gap-2 justify-center">
      <span>\(x = v \cdot t\) &rarr; {{ metros }} m = {{ velocidadNumMs.toFixed(2) }} m/s × {{ tiempo.toFixed(2) }} s</span>
    </div>

    <!-- Pregunta interactiva -->
    <div v-if="showPregunta" class="mt-8 p-6 rounded-lg bg-green-950/80 border border-green-500 shadow flex flex-col items-center gap-3 w-full max-w-md mx-auto">
      <div class="text-green-300 mb-2 text-lg font-bold">Reto rápido:</div>
      <div class="text-green-100 mb-2">¿Cuál será la posición final si la velocidad es {{ velocidadDisplay }} durante {{ tiempoPregunta }} segundos?</div>
      <input v-model="respuestaEstudiante" type="number" step="0.01" class="rounded px-3 py-2 border border-green-400 text-green-800 font-bold text-lg w-32 text-center">
      <button @click="verificarRespuesta" class="mt-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-bold">Verificar</button>
      <div v-if="feedback" :class="feedbackCorrecto ? 'text-green-400' : 'text-red-400'" class="font-bold">{{ feedback }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

const trayectoMax = 800;
const posX = ref(0);
const velocidadInput = ref(5);
const seleccionUnidad = ref('px/s');
const color = ref('#22d3ee');
const running = ref(false);
const tiempo = ref(0);
let animationFrame = null;
let lastTimestamp = null;

const trayectoriaCanvas = ref(null);

// Conversiones de velocidad e info de unidades
const velocidadNumPxS = computed(() => {
  if (seleccionUnidad.value === 'px/s') return +velocidadInput.value;
  if (seleccionUnidad.value === 'm/s') return +velocidadInput.value * 100; // 1m=100px
  if (seleccionUnidad.value === 'km/h') return +velocidadInput.value * 100 / 3.6;
  return +velocidadInput.value;
});
const velocidadNumMs = computed(() => velocidadNumPxS.value / 100);
const metros = computed(() => (posX.value / 100).toFixed(2));
const velocidadDisplay = computed(() => `${velocidadInput.value} ${seleccionUnidad.value}`);

// Pregunta/Reto al final
const showPregunta = ref(false);
const tiempoPregunta = ref(Math.floor(2 + Math.random() * 3) * 5); // 10, 15 segundos...
const respuestaEstudiante = ref('');
const feedback = ref('');
const feedbackCorrecto = ref(false);

function mover(timestamp) {
  if (!running.value) return;
  if (!lastTimestamp) lastTimestamp = timestamp;

  const delta = (timestamp - lastTimestamp) / 1000;
  lastTimestamp = timestamp;

  if (posX.value < trayectoMax) {
    posX.value += velocidadNumPxS.value * delta;
    tiempo.value += delta;
    drawTrayectoria();
    animationFrame = requestAnimationFrame(mover);
  } else {
    posX.value = trayectoMax;
    running.value = false;
    showPregunta.value = true;
  }
}

// Dibuja la trayectoria en canvas
function drawTrayectoria() {
  const canvas = trayectoriaCanvas.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = color.value;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(24, canvas.height / 2);
  ctx.lineTo(posX.value + 24, canvas.height / 2);
  ctx.stroke();
}

function iniciar() {
  if (!running.value) {
    running.value = true;
    lastTimestamp = null;
    animationFrame = requestAnimationFrame(mover);
    showPregunta.value = false;
    feedback.value = '';
    respuestaEstudiante.value = '';
    tiempo.value = 0;
    posX.value = 0;
    drawTrayectoria();
  }
}

function detener() {
  running.value = false;
  if (animationFrame) cancelAnimationFrame(animationFrame);
}

function reset() {
  detener();
  posX.value = 0;
  tiempo.value = 0;
  lastTimestamp = null;
  showPregunta.value = false;
  respuestaEstudiante.value = '';
  feedback.value = '';
  drawTrayectoria();
}

// Pregunta automática al finalizar
function verificarRespuesta() {
  const esperado = (velocidadNumMs.value * tiempoPregunta.value).toFixed(2);
  if (Math.abs(Number(respuestaEstudiante.value) - esperado) < 0.05) {
    feedback.value = "¡Correcto! La posición final es " + esperado + " m.";
    feedbackCorrecto.value = true;
  } else {
    feedback.value = "Incorrecto. 🎯 Recuerda: x = v × t = " + velocidadNumMs.value.toFixed(2) + " × " + tiempoPregunta.value + " = " + esperado + " m";
    feedbackCorrecto.value = false;
  }
}

// Redibuja al cambiar color/velocidad
watch([velocidadInput, color], drawTrayectoria);
onMounted(drawTrayectoria);
</script>
