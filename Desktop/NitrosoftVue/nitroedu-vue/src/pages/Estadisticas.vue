<template>
  <div class="min-h-screen px-4 py-8 bg-gradient-to-br from-black via-[#161d14] to-green-950 text-green-100 font-sans flex flex-col items-center">
    <h1 class="text-3xl font-extrabold mb-10 text-green-400 text-center drop-shadow">Estadísticas de Perfil</h1>
    <!-- Tiempo de conexión -->
    <section class="mb-8 bg-black/70 border border-green-700 rounded-2xl p-6 shadow-xl max-w-xl w-full mx-auto flex flex-col gap-3">
      <h2 class="text-2xl font-bold mb-2 text-green-300">Tiempo de conexión</h2>
      <p class="text-lg">Has estado conectado durante: <strong class="text-green-400">{{ tiempoConexionFormateado }}</strong></p>
    </section>
    <!-- Estadísticas generales -->
    <section class="mb-8 bg-black/70 border border-green-700 rounded-2xl p-6 shadow-xl max-w-xl w-full mx-auto flex flex-col gap-3">
      <h2 class="text-2xl font-bold mb-2 text-green-300">Estadísticas generales</h2>
      <p>Total de exámenes realizados: <strong class="text-green-400">{{ totalExamenes }}</strong></p>
      <p>Promedio general: <strong class="text-green-400">{{ promedioGeneral.toFixed(2) }} / 5</strong></p>
      <p>
        Estado: 
        <strong :class="promedioGeneral >= 3 ? 'text-green-400' : 'text-red-400'">
          {{ promedioGeneral >=3 ? 'Aprobado' : 'Reprobado' }}
        </strong>
      </p>
    </section>
    <!-- Resultados por examen -->
    <section class="w-full max-w-2xl mx-auto">
      <h2 class="text-2xl font-bold mb-3 text-green-300 text-center">Resultados por examen</h2>
      <div v-for="examen in examenes" :key="examen.id" class="bg-gradient-to-br from-[#161e17ed] to-[#1b381bd9] border border-green-700 rounded-2xl p-6 mb-7 shadow-xl w-full">
        <h3 class="text-xl font-extrabold mb-2 text-green-200">{{ examen.nombre }}</h3>
        <p>Puntaje: <strong class="text-green-400">{{ examen.puntaje }} / {{ examen.total }}</strong></p>
        <!-- Gráfica del examen -->
        <canvas :id="'chart-'+examen.id" class="w-full max-w-[380px] mt-5 mx-auto bg-black border border-green-900 rounded-lg" height="80"></canvas>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import Chart from 'chart.js/auto'

const usuarioId = 'usuario123'

const tiempoConexionFormateado = ref('0h 0m 0s')
const examenes = ref([])
const totalExamenes = ref(0)
const promedioGeneral = ref(0)

// Simulación de tiempo de conexión
function calcularTiempoConexion() {
  const segundos = 1*3600 + 30*60 + 50
  const h = Math.floor(segundos / 3600)
  const m = Math.floor((segundos % 3600) / 60)
  const s = segundos % 60
  tiempoConexionFormateado.value = `${h}h ${m}m ${s}s`
}

async function cargarEstadisticas() {
  const q = query(collection(db, 'resultados'), where('usuarioId', '==', usuarioId), orderBy('fecha'))
  const snapshot = await getDocs(q)
  const tempExamenes = {}
  snapshot.forEach(doc => {
    const data = doc.data()
    if(!tempExamenes[data.examenId]) {
      tempExamenes[data.examenId] = {
        id: data.examenId,
        nombre: data.examenNombre,
        puntajes: [],
        total: data.total
      }
    }
    tempExamenes[data.examenId].puntajes.push(data.puntaje)
  })

  examenes.value = Object.values(tempExamenes).map(ex => {
    const sum = ex.puntajes.reduce((a,b) => a+b, 0)
    const prom = sum / ex.puntajes.length
    return {
      ...ex,
      puntaje: prom.toFixed(2),
    }
  })

  const sumatorios = examenes.value.reduce((a,b) => a + parseFloat(b.puntaje), 0)
  promedioGeneral.value = examenes.value.length ? (sumatorios / examenes.value.length) : 0
  totalExamenes.value = examenes.value.length || 0
  setTimeout(dibujarGraficas, 150)
}

function dibujarGraficas() {
  examenes.value.forEach(examen => {
    const ctx = document.getElementById('chart-' + examen.id)?.getContext('2d')
    if(!ctx) return
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: examen.puntajes.map((_, i) => i+1),
        datasets: [{
          label: 'Puntaje',
          data: examen.puntajes.map(p => parseFloat(p)),
          fill: true,
          borderColor: '#31c56e',
          backgroundColor: 'rgba(49, 197, 110, 0.15)',
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        aspectRatio: 3.5,
        scales: {
          y: {
            min: 0,
            max: 5,
            ticks: { stepSize: 1 }
          }
        }
      }
    })
  })
}

onMounted(() => {
  calcularTiempoConexion()
  cargarEstadisticas()
})
</script>
