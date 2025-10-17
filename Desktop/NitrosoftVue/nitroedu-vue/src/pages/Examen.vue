<template>
  <div class="min-h-screen px-4 py-10 bg-gradient-to-br from-black via-[#171717] to-[#232323] text-green-200 font-sans flex flex-col items-center">
    <div class="w-full max-w-3xl mx-auto relative">
      <!-- Barra sticky -->
      <div
        class="sticky top-0 left-0 z-20 w-full p-4 rounded-2xl border border-green-700 shadow-xl backdrop-blur-lg"
        :class="[minutos <= 5 ? 'bg-yellow-900/80 via-green-900/90 to-green-950/80 animate__animated animate__flash animate__slower' : 'bg-[#101910cc]']"
      >
        <div class="flex justify-between items-center gap-5">
          <div class="text-lg font-semibold select-none">
            Tiempo restante:
            <span :class="minutos<=5 ? 'text-yellow-300 font-bold' : 'text-green-400 font-bold'" class="bg-[#141914cc] px-3 py-1 rounded">
              {{ minutos }}:{{ segundosFormateados }}
            </span>
          </div>
          <div class="w-40">
            <div class="w-full h-5 bg-green-950 rounded-full overflow-hidden shadow">
              <div
                class="h-5 rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-700"
                :style="{ width: progreso + '%' }"
              ></div>
            </div>
            <div class="text-green-300 text-xs font-bold text-center mt-1">{{ progreso }}% completado</div>
          </div>
        </div>
      </div>

      <h2 class="text-3xl font-extrabold mb-4 mt-8 text-green-400 text-center drop-shadow">Examen - {{ nombreMateria }}</h2>

      <form @submit.prevent="terminarExamen" class="bg-black/70 border border-green-700 rounded-2xl shadow-2xl p-8 flex flex-col gap-8 mb-8">
        <div
          v-for="(preg, idx) in preguntas"
          :key="preg.id"
          :class="[
            'group p-4 rounded-lg border-2 transition duration-300 mb-2',
            respuestas[idx] ? 'border-green-600 bg-green-900/40' : 'border-green-700 bg-transparent'
          ]"
        >
          <div class="flex justify-between items-center mb-2">
            <div class="font-bold text-green-300 text-lg">{{ idx+1 }}. {{ preg.pregunta }}</div>
            <div
              v-if="respuestas[idx]"
              class="text-green-300 font-semibold text-sm select-none"
            >Respondida</div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              v-for="resp in preg.opciones"
              :key="resp"
              class="flex items-center bg-[#171e17cc] border border-green-800/60 rounded-lg px-3 py-2 cursor-pointer hover:bg-green-700/50 transition select-none"
              :class="{ 'bg-green-700/60': respuestas[idx] === resp }"
            >
              <input
                type="radio"
                :name="'pregunta_' + idx"
                :value="resp"
                v-model="respuestas[idx]"
                required
                class="accent-green-500 mr-4 h-5 w-5 cursor-pointer"
              />
              <span class="text-green-200">{{ resp }}</span>
            </label>
          </div>
          <transition name="fade">
            <div v-if="errorPreguntas[idx]" class="text-red-600 text-xs mt-1 select-none">* Debes responder esta pregunta</div>
          </transition>
        </div>
        <div class="flex items-center justify-between text-xl font-semibold">
          <div>Preguntas respondidas: {{ respondidas }} / {{ preguntas.length }}</div>
        </div>
        <button
          type="submit"
          :disabled="respondidas < preguntas.length"
          class="mt-4 py-3 rounded-lg bg-gradient-to-r from-green-600 to-green-400 text-xl font-bold text-white shadow hover:from-green-700 hover:to-green-500 transition focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Terminar examen
        </button>
      </form>
    </div>

    <!-- MODAL FINALIZADO -->
    <transition name="fade">
      <div v-if="mostrarModal" class="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 px-4 py-8">
        <div class="bg-gradient-to-br from-black via-green-900 to-green-400 text-green-50 p-10 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm w-full animate__animated animate__zoomIn">
          <h3 class="text-2xl font-bold mb-5 text-center">¡Examen finalizado!</h3>
          <p class="mb-7 text-lg text-center">Puntaje total: <span class="font-extrabold text-green-300">{{ puntaje }}/{{ preguntas.length }}</span></p>
          <button
            class="py-2 px-6 rounded-lg bg-gradient-to-r from-green-600 to-green-400 text-lg font-bold text-white shadow hover:from-green-700 hover:to-green-500 transition focus:outline-none focus:ring-2 focus:ring-green-500"
            @click="cerrarModal"
          >
            Volver a Evaluaciones
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { db } from '../firebase'
import { collection, getDocs, query, where, addDoc, doc, setDoc, Timestamp, increment } from 'firebase/firestore'
import 'animate.css'

const usuarioId = 'usuario_demo_1'

const route = useRoute()
const router = useRouter()
const nombreMateria = ref('')
const preguntas = ref([])
const respuestas = ref([])
const puntaje = ref(0)
const mostrarModal = ref(false)
const minutos = ref(30)
const segundos = ref(0)
let timer = null
const tiempoTomado = ref(0)
const errorPreguntas = ref([])

const iniciarCronometro = () => {
  timer = setInterval(() => {
    tiempoTomado.value++
    if (segundos.value === 0) {
      if (minutos.value === 0) {
        clearInterval(timer)
        terminarExamen()
      } else {
        minutos.value--
        segundos.value = 59
      }
    } else segundos.value--
  }, 1000)
}

const segundosFormateados = computed(() => String(segundos.value).padStart(2, '0'))

const progreso = computed(() => {
  const respondidasCount = respuestas.value.filter(r => r !== '').length
  return Math.floor((respondidasCount / preguntas.value.length) * 100)
})

const respondidas = computed(() => respuestas.value.filter(r => r !== '').length)

const cargarPreguntas = async () => {
  nombreMateria.value = route.params.materiaId || ''
  const q = query(collection(db, 'preguntas'), where('materia', '==', nombreMateria.value))
  const snaps = await getDocs(q)
  preguntas.value = snaps.docs.map(doc => ({ id: doc.id, ...doc.data() })).slice(0, 10)
  respuestas.value = Array(preguntas.value.length).fill('')
  errorPreguntas.value = Array(preguntas.value.length).fill(false)
  iniciarCronometro()
}

onMounted(() => {
  cargarPreguntas()
})

const validarRespuestas = () => {
  let todoOk = true
  errorPreguntas.value = errorPreguntas.value.map(() => false)
  respuestas.value.forEach((r, i) => {
    if (!r || r === '') {
      errorPreguntas.value[i] = true
      todoOk = false
    }
  })
  return todoOk
}

const terminarExamen = async () => {
  if (!validarRespuestas()) return
  clearInterval(timer)
  let puntos = 0
  for (let i = 0; i < preguntas.value.length; i++) {
    if (respuestas.value[i] === preguntas.value[i].respuestaCorrecta) puntos++
  }
  puntaje.value = puntos

  await addDoc(collection(db, 'resultados_examen'), {
    usuarioId,
    materia: nombreMateria.value,
    examenId: route.params.examenId || '',
    puntaje: puntos,
    fecha: Timestamp.now()
  })

  const minutosSesion = Math.ceil(tiempoTomado.value / 60)
  await setDoc(
    doc(db, 'usuarios_stats', usuarioId),
    {
      ultimoLogin: Timestamp.now(),
      tiempoTotalConexion: increment(minutosSesion)
    },
    { merge: true }
  )

  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
  router.push('/dashboard/evaluaciones')
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.sticky {
  position: sticky;
  top: 0;
  left: 0;
  z-index: 30;
}
</style>
