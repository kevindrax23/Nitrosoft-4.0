<template>
  <div class="min-h-screen px-4 py-10 bg-gradient-to-br from-black via-[#141914] to-green-950 text-green-100 font-mono flex flex-col items-center">
    <div class="w-full max-w-2xl mx-auto">
      <h2 class="text-3xl font-extrabold mb-6 text-green-400 text-center drop-shadow">Examen - {{ nombreMateria }}</h2>
      <div class="mb-7 text-xl text-center font-semibold">
        Tiempo restante: <span class="font-bold text-green-400 bg-[#14191466] px-2 py-1 rounded">{{ minutos }}:{{ segundosFormateados }}</span>
      </div>
      <form @submit.prevent="terminarExamen" class="bg-black/70 border border-green-700 rounded-2xl shadow-2xl p-7 w-full flex flex-col gap-6">
        <div v-for="(preg, idx) in preguntas" :key="preg.id" class="mb-3">
          <div class="font-bold mb-2 text-green-300 text-lg">{{ idx + 1 }}. {{ preg.pregunta }}</div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label
              v-for="resp in preg.opciones"
              :key="resp"
              class="flex items-center bg-[#171e17cc] border border-green-800/60 rounded-lg px-3 py-2 hover:bg-green-700/40 transition"
            >
              <input
                type="radio"
                :name="'pregunta_' + idx"
                :value="resp"
                v-model="respuestas[idx]"
                required
                class="accent-green-500 mr-3 h-4 w-4"
              />
              <span class="text-green-200">{{ resp }}</span>
            </label>
          </div>
        </div>
        <button
          type="submit"
          class="mt-3 py-3 px-7 rounded-lg bg-gradient-to-r from-green-600 to-green-400 text-xl font-bold text-white shadow hover:from-green-700 hover:to-green-500 transition focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Terminar examen
        </button>
      </form>
    </div>
    <div v-if="mostrarModal" class="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 px-4 py-8">
      <div class="bg-gradient-to-br from-black via-green-900 to-green-400 text-green-50 p-10 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm w-full">
        <h3 class="text-2xl font-bold mb-5">¡Examen finalizado!</h3>
        <p class="mb-7 text-lg">Puntaje total: <span class="font-extrabold text-green-300">{{ puntaje }}/{{ preguntas.length }}</span></p>
        <button
          class="py-2 px-6 rounded-lg bg-gradient-to-r from-green-600 to-green-400 text-lg font-bold text-white shadow hover:from-green-700 hover:to-green-500 transition focus:outline-none focus:ring-2 focus:ring-green-500"
          @click="cerrarModal"
        >
          Volver a Evaluaciones
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { db } from '../firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'

const route = useRoute()
const router = useRouter()
const nombreMateria = ref('Materia')
const preguntas = ref([])
const respuestas = ref(Array(10).fill(''))
const puntaje = ref(0)
const mostrarModal = ref(false)
const minutos = ref(30)
const segundos = ref(0)
let timer = null

onMounted(async () => {
  nombreMateria.value = route.params.materiaId
  const q = query(collection(db, 'preguntas'), where('materia', '==', nombreMateria.value))
  const snaps = await getDocs(q)
  preguntas.value = snaps.docs.map(doc => ({ id: doc.id, ...doc.data() })).slice(0, 10)
  iniciarCronometro()
})

function iniciarCronometro() {
  timer = setInterval(() => {
    if (segundos.value === 0) {
      if (minutos.value === 0) {
        terminarExamen()
        clearInterval(timer)
      } else {
        minutos.value--
        segundos.value = 59
      }
    } else {
      segundos.value--
    }
  }, 1000)
}
const segundosFormateados = computed(() => String(segundos.value).padStart(2, '0'))

function terminarExamen() {
  clearInterval(timer)
  let puntos = 0
  for (let i = 0; i < preguntas.value.length; i++) {
    if (respuestas.value[i] === preguntas.value[i].respuestaCorrecta) {
      puntos++
    }
  }
  puntaje.value = puntos
  mostrarModal.value = true
}

function cerrarModal() {
  mostrarModal.value = false
  router.push('/dashboard/evaluaciones')
}
</script>
