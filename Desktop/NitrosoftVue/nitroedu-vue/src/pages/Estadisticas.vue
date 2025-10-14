<template>
  <div class="min-h-screen bg-gradient-to-br from-black via-[#161d14] to-green-950 px-4 py-10 flex flex-col items-center">
    <div class="max-w-3xl w-full mx-auto mb-8 bg-black/70 border border-green-700 rounded-2xl shadow-lg px-7 py-6">
      <h2 class="text-green-400 text-2xl font-extrabold mb-4 animate__animated animate__fadeInDown">Estadísticas personales</h2>
      <div class="flex flex-col sm:flex-row gap-6 text-green-200 justify-between">
        <div><span class="font-bold">Última conexión:</span> {{ ultimaConexionFormat }}</div>
        <div><span class="font-bold">Tiempo total conectado:</span> {{ tiempoTotalConexion }} min</div>
      </div>
      <div class="mt-3 flex flex-wrap gap-5 items-end animate__animated animate__fadeIn">
        <div>
          <span class="font-bold text-green-400">Promedio global:</span>
          <span :class="averageClass(promedioGlobal)">
            {{ promedioGlobal }} / 100
          </span>
          <span v-if="promedioGlobal >= 80" class="ml-2 text-2xl text-green-400 animate__pulse animate__infinite">⭐</span>
          <span v-else-if="promedioGlobal >= 60" class="ml-2 text-yellow-200">¡Vas bien!</span>
          <span v-else-if="promedioGlobal > 0" class="ml-2 text-red-400">¡Vamos, tú puedes subir más!</span>
        </div>
        <button
          class="px-3 py-1 text-green-400 border border-green-500 bg-green-950/70 rounded hover:bg-green-700 transition ml-6"
          @click="exportarExcel">Exportar a Excel</button>
      </div>
    </div>

    <!-- Últimos resultados individualizados -->
    <div class="max-w-4xl w-full mx-auto bg-black/70 border border-green-700 rounded-2xl shadow-lg px-7 py-6 mb-8">
      <h3 class="text-green-400 text-xl font-bold mb-6">Resultados del último examen por materia</h3>
      <div v-if="resultados.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div v-for="r in resultados" :key="r.id"
          class="bg-gradient-to-br from-[#1b3822e6] to-[#183c1bc4] border border-green-700 rounded-xl shadow p-5 relative transition hover:ring-2 hover:ring-green-500 animate__animated animate__fadeInUp">
          <div class="absolute top-2 right-3 text-xs px-2 py-1 rounded-lg"
              :class="r.puntaje >= 80 ? 'bg-green-900 text-green-300' : r.puntaje >= 60 ? 'bg-yellow-900 text-yellow-300' : 'bg-red-900 text-red-300'">
            {{ r.puntaje >= 80 ? '¡Record!' : r.puntaje >= 60 ? 'Constante' : '¡Hazlo de nuevo!' }}
          </div>
          <div class="text-green-300 mb-2 font-bold text-lg">{{ r.materiaNombre }}</div>
          <div class="text-green-200">Examen: <b>{{ r.examenNombre }}</b></div>
          <div class="text-xl font-bold mb-1" :class="averageClass(r.puntaje)">{{ r.puntaje }}</div>
          <div class="text-green-200 text-sm mt-1">Fecha: {{ r.fechaString }}</div>
          <div class="text-green-400 text-xs mt-2">Prom. en esta materia: {{ promediosEnTarjetas[r.materiaNombre] || 0 }}</div>
        </div>
      </div>
      <div v-else class="text-green-300 text-center py-6">No hay resultados aún.</div>
    </div>

    <!-- Barra horizontal animada promedios por materia -->
    <div class="max-w-2xl w-full mx-auto mb-8">
      <h3 class="text-green-400 text-lg font-bold mb-4">Tus promedios por materia</h3>
      <div
        v-for="p in resumenMaterias"
        :key="p.materia"
        class="mb-4 flex items-center gap-4"
      >
        <div class="w-32 font-bold text-green-300">{{ p.materia }}</div>
        <div class="flex-1 h-7 bg-green-900 rounded overflow-hidden">
          <div
            class="h-7 rounded bg-gradient-to-r from-green-400 to-green-700 text-green-950 pl-2 flex items-center transition-all duration-700"
            :style="{ width: (p.promedio >= 100 ? 100 : p.promedio) + '%' }"
          >
            {{ p.promedio }}
          </div>
        </div>
        <span v-if="p.promedio >= 80" class="ml-2 text-green-400">⭐</span>
      </div>
    </div>

    <!-- Ranking panel simulación -->
    <div class="max-w-2xl w-full mx-auto mb-8">
      <h3 class="text-green-400 text-lg font-bold mb-4">¿Cómo vas en el ranking?</h3>
      <div class="flex gap-5 items-center">
        <div class="bg-green-900/80 text-green-200 font-bold px-4 py-2 rounded-xl ring-2 ring-green-500">Tu puntaje está por encima del 65% de los usuarios ⭐</div>
        <button class="bg-green-600 rounded px-3 py-1 text-white hover:bg-green-700 shadow text-sm">Ver ranking global (próximamente)</button>
      </div>
    </div>

    <!-- Tabla avanzada de tendencias y máximos/mínimos -->
    <div class="max-w-3xl w-full mx-auto mb-8">
      <h3 class="text-green-400 text-lg font-bold mb-4">Resumen y progreso</h3>
      <table class="w-full table-auto bg-black/80 rounded-xl text-green-100 shadow mb-6 text-center">
        <thead>
          <tr class="bg-green-900/80 text-green-300">
            <th class="p-2">Materia</th>
            <th class="p-2">Promedio</th>
            <th class="p-2">Máx</th>
            <th class="p-2">Mín</th>
            <th class="p-2">Últ. 5</th>
            <th class="p-2">Tendencia</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in resumenMaterias" :key="m.materia">
            <td class="p-2">{{ m.materia }}</td>
            <td class="p-2">{{ m.promedio }}</td>
            <td class="p-2 text-green-400">{{ m.max }}</td>
            <td class="p-2 text-red-300">{{ m.min }}</td>
            <td class="p-2">
              <span v-for="(p,idx) in m.ultimos5" :key="idx"
                :class="p >= 80 ? 'text-green-400' : p >= 60 ? 'text-yellow-300' : 'text-red-300'"
                class="mx-1">{{ p }}</span>
            </td>
            <td class="p-2">
              <span v-if="m.tendencia > 0" class="text-green-400 font-bold animate__flash animate__infinite">▲{{ m.tendencia }}</span>
              <span v-else-if="m.tendencia < 0" class="text-red-400 font-bold animate__shakeX animate__infinite">▼{{ Math.abs(m.tendencia) }}</span>
              <span v-else class="text-neutral-400">-</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { db } from '../firebase';
import { collection, query, where, orderBy, limit, getDocs, doc, getDoc } from 'firebase/firestore';

// Importa animate.css para animaciones (añade en tu main.js o index.html)
import 'animate.css';

const usuarioId = "usuario_demo_1";

const ultimaConexion = ref('');
const tiempoTotalConexion = ref(0);
const resultados = ref([]);
const promedioGlobal = ref(0);
const resumenMaterias = ref([]);
const promediosEnTarjetas = ref({});

const materiasNombres = {
  matematicas: "Matemáticas",
  geometria: "Geometría",
  algebra: "Álgebra",
  trigonometria: "Trigonometría"
};

const examenesNombres = {
  mat1: "Matemáticas 1",
  mat2: "Matemáticas 2 (Avanzado)",
  geo1: "Geometría 1",
  geo2: "Geometría 2",
  alg1: "Álgebra 1",
  alg2: "Álgebra 2",
  tri1: "Trigonometría 1",
  tri2: "Trigonometría 2"
};

const examenes = [
  { id: "mat1", nombre: "Matemáticas 1", materia: "matematicas" },
  { id: "mat2", nombre: "Matemáticas 2 (Avanzado)", materia: "matematicas" },
  { id: "geo1", nombre: "Geometría 1", materia: "geometria" },
  { id: "geo2", nombre: "Geometría 2", materia: "geometria" },
  { id: "alg1", nombre: "Álgebra 1", materia: "algebra" },
  { id: "alg2", nombre: "Álgebra 2", materia: "algebra" },
  { id: "tri1", nombre: "Trigonometría 1", materia: "trigonometria" },
  { id: "tri2", nombre: "Trigonometría 2", materia: "trigonometria" }
];

onMounted(async () => {
  // Datos generales (conexión, tiempo)
  const userRef = doc(db, 'usuarios_stats', usuarioId);
  const userDoc = await getDoc(userRef);
  if (userDoc.exists()) {
    const d = userDoc.data();
    ultimaConexion.value = d.ultimoLogin?.toDate();
    tiempoTotalConexion.value = d.tiempoTotalConexion ?? 0;
  }
  // Últimos resultados por examen específico
  const resultadosExamenes = [];
  let allScores = [];
  const promsTarjetas = {};
  const summary = [];
  const materias = Object.keys(materiasNombres);

  for (const ex of examenes) {
    const q = query(
      collection(db, 'resultados_examen'),
      where('usuarioId', '==', usuarioId),
      where('materia', '==', ex.materia),
      where('examenId', '==', ex.id),
      orderBy('fecha', 'desc'),
      limit(1)
    );
    const docs = await getDocs(q);
    if (!docs.empty) {
      const dato = docs.docs[0].data();
      resultadosExamenes.push({
        id: ex.id,
        materiaNombre: materiasNombres[ex.materia],
        examenNombre: examenesNombres[ex.id] || ex.id,
        puntaje: dato.puntaje,
        fechaString: dato.fecha?.toDate().toLocaleDateString() || ""
      });
    }
  }
  resultados.value = resultadosExamenes;

  // Resumen por materia (prom, máx, mín, tendencia)
  for (const materia of materias) {
    const q = query(
      collection(db, 'resultados_examen'),
      where('usuarioId', '==', usuarioId),
      where('materia', '==', materia),
      orderBy('fecha', 'desc')
    );
    const docs = await getDocs(q);
    const califs = [];
    docs.forEach(doc => {
      const d = doc.data();
      if (d.puntaje != null) {
        califs.push(Number(d.puntaje));
        allScores.push(Number(d.puntaje));
      }
    });
    if (califs.length) {
      promsTarjetas[materiasNombres[materia]] = (califs.reduce((a, b) => a + b, 0) / califs.length).toFixed(1);
    }
    summary.push({
      materia: materiasNombres[materia],
      promedio: califs.length ? (califs.reduce((a, b) => a + b, 0) / califs.length).toFixed(1) : 0,
      max: califs.length ? Math.max(...califs) : "-",
      min: califs.length ? Math.min(...califs) : "-",
      ultimos5: califs.slice(0, 5),
      tendencia: califs.length > 1 ? califs[0] - califs[1] : 0
    });
  }
  resumenMaterias.value = summary;
  promediosEnTarjetas.value = promsTarjetas;
  promedioGlobal.value = allScores.length ? (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(1) : 0;
});

function exportarExcel() {
  alert("Función de exportar aún no activada (requiere plugin externo, como SheetJS).");
}

function averageClass(avg) {
  if (avg >= 80) return 'text-green-400 font-bold';
  if (avg >= 60) return 'text-yellow-300 font-bold';
  if (avg > 0) return 'text-red-300 font-bold';
  return '';
}

const ultimaConexionFormat = computed(() =>
  ultimaConexion.value ? new Date(ultimaConexion.value).toLocaleString() : "Nunca"
);
</script>
