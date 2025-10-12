<template>
  <div class="min-h-screen p-10 bg-gradient-to-br from-[#181C25] via-blue-900 to-[#007fff] text-white font-mono">
    <h1 class="text-3xl font-bold mb-8">Estadísticas de Perfil</h1>
    <!-- Tiempo de conexión -->
    <section class="mb-10 bg-[#20283a] rounded p-6 shadow-inner max-w-xl">
      <h2 class="text-2xl font-semibold mb-4">Tiempo de conexión</h2>
      <p>Has estado conectado durante: <strong>{{ tiempoConexionFormateado }}</strong></p>
    </section>
    <!-- Estadísticas generales -->
    <section class="mb-10 bg-[#20283a] rounded p-6 shadow-inner max-w-xl">
      <h2 class="text-2xl font-semibold mb-4">Estadísticas generales</h2>
      <p>Total de exámenes realizados: <strong>{{ totalExamenes }}</strong></p>
      <p>Promedio general: <strong>{{ promedioGeneral.toFixed(2) }} / 5</strong></p>
      <p>Estado: <strong :class="promedioGeneral >= 3 ? 'text-green-400' : 'text-red-400'">{{ promedioGeneral >=3 ? 'Aprobado' : 'Reprobado' }}</strong></p>
    </section>
    <!-- Resultados por examen -->
    <section>
      <h2 class="text-2xl font-semibold mb-4">Resultados por examen</h2>
      <div v-for="examen in examenes" :key="examen.id" class="bg-[#20283a] rounded p-6 mb-6 shadow-md max-w-xl">
        <h3 class="text-xl font-bold mb-2">{{ examen.nombre }}</h3>
        <p>Puntaje: <strong>{{ examen.puntaje }} / {{ examen.total }}</strong></p>
        <!-- Gráfica del examen -->
        <canvas :id="'chart-'+examen.id" class="max-w-full" height="80"></canvas>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { db } from '../firebase'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import Chart from 'chart.js/auto'

const usuarioId = 'usuario123' // Obtén el ID real de usuario del auth o session

const tiempoConexionFormateado = ref('0h 0m 0s')
const examenes = ref([])
const totalExamenes = ref(0)
const promedioGeneral = ref(0)

// Simulación de tiempo de conexión (deberías adaptar a tu auth/session)
function calcularTiempoConexion() {
  // Ejemplo dummy 1h30m50s
  const segundos = 1*3600 + 30*60 + 50
  const h = Math.floor(segundos / 3600)
  const m = Math.floor((segundos % 3600) / 60)
  const s = segundos % 60
  tiempoConexionFormateado.value = `${h}h ${m}m ${s}s`
}

// Cargar estadísticas de exámenes desde Firestore
async function cargarEstadisticas() {
  // Consulta la colección 'resultados' donde guardas resultados (debe tener campos: usuarioId, examenId, puntaje, total, fecha)
  const q = query(collection(db, 'resultados'), where('usuarioId', '==', usuarioId), orderBy('fecha'))
  const snapshot = await getDocs(q)
  
  // Procesa resultados por examen
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
    // calcula promedio por examen
    const sum = ex.puntajes.reduce((a,b) => a+b, 0)
    const prom = sum / ex.puntajes.length
    return {
      ...ex,
      puntaje: prom.toFixed(2),
    }
  })

  // Promedio general
  const sumatorios = examenes.value.reduce((a,b) => a + parseFloat(b.puntaje), 0)
  promedioGeneral.value = examenes.value.length ? (sumatorios / examenes.value.length) : 0

  // CORREGIDO AQUÍ:
  totalExamenes.value = examenes.value.length || 0

  // Dibuja las gráficas:
  setTimeout(dibujarGraficas, 200)
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
          fill: false,
          borderColor: '#007fff',
          tension: 0.2
        }]
      },
      options: {
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
