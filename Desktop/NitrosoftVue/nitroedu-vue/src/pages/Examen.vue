<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#181C25] via-blue-900 to-[#007fff] p-6 font-mono">
    <div class="w-full max-w-2xl bg-[#181C25] p-8 rounded-xl shadow-lg text-white">
      <h2 class="text-2xl font-bold mb-4">Examen - {{ nombreMateria }}</h2>
      <div class="mb-6">
        Tiempo restante: <span class="font-bold text-[#007fff]">{{ minutos }}:{{ segundosFormateados }}</span>
      </div>
      <form @submit.prevent="terminarExamen">
        <div v-for="(preg, idx) in preguntas" :key="preg.id" class="mb-4">
          <div class="font-semibold mb-1">{{ idx + 1 }}. {{ preg.pregunta }}</div>
          <div class="flex flex-col gap-1">
            <label v-for="resp in preg.opciones" :key="resp">
              <input
                type="radio"
                :name="'pregunta_' + idx"
                :value="resp"
                v-model="respuestas[idx]"
                required
                class="mr-2"
              />{{ resp }}
            </label>
          </div>
        </div>
        <button
          type="submit"
          class="mt-5 py-3 px-5 bg-blue-600 rounded font-bold w-full transition hover:bg-blue-800"
        >Terminar examen</button>
      </form>
    </div>
    <!-- Modal de puntaje -->
    <div v-if="mostrarModal" class="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
      <div class="bg-gradient-to-br from-[#181C25] via-blue-900 to-[#007fff] text-white p-10 rounded-lg shadow-xl flex flex-col items-center">
        <h3 class="text-xl font-bold mb-4">¡Examen finalizado!</h3>
        <p class="mb-5">Puntaje total: {{ puntaje }}/{{ preguntas.length }}</p>
        <button
          class="py-2 px-4 rounded bg-blue-700 text-white"
          @click="cerrarModal"
        >Volver a Evaluaciones</button>
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

// Cargar preguntas desde Firestore
onMounted(async () => {
  nombreMateria.value = route.params.materiaId // Cambia esto por el nombre real si quieres
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
